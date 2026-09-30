
function favoritosLocais() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    return Array.isArray(favoritos) ? favoritos : [];
}

function atualizarContadorFavoritos(total = favoritosLocais().length) {
    const contador = document.getElementById("contador-favoritos");
    if (contador) contador.innerText = total;
}

function aplicarEstadoBotao(botao, favoritado) {
    botao.innerHTML = favoritado ? "❤️" : "🤍";
    botao.classList.toggle("favoritado", favoritado);
}

async function favoritarProduto(botao, nome, preco, imagem) {
    const produtoId = Number(botao.dataset.produtoId);
    if (produtoId) {
        try {
            const resposta = await fetch("../php/favoritos.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produto_id: produtoId })
            });
            const retorno = await resposta.json();
            if (resposta.status !== 401) {
                if (!resposta.ok) throw new Error(retorno.mensagem || "Não foi possível salvar o favorito.");
                aplicarEstadoBotao(botao, retorno.favoritado);
                atualizarContadorFavoritos(retorno.total);
                return;
            }
        } catch (erro) {
            alert(erro.message);
            return;
        }
    }

    const favoritos = favoritosLocais();
    const indice = favoritos.findIndex(produto => produto.produtoId === produtoId || produto.nome === nome);
    if (indice >= 0) {
        favoritos.splice(indice, 1);
        aplicarEstadoBotao(botao, false);
    } else {
        favoritos.push({ produtoId, nome, preco, imagem });
        aplicarEstadoBotao(botao, true);
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    atualizarContadorFavoritos(favoritos.length);
}

async function buscarFavoritos() {
    try {
        const resposta = await fetch("../php/favoritos.php");
        if (resposta.status === 401) return favoritosLocais();
        if (!resposta.ok) throw new Error("Não foi possível carregar os favoritos.");
        return (await resposta.json()).map(produto => ({
            produtoId: Number(produto.produto_id),
            nome: produto.nome,
            preco: Number(produto.preco_centavos) / 100,
            imagem: produto.imagem
        }));
    } catch (erro) {
        return favoritosLocais();
    }
}

async function carregarFavoritos() {
    const lista = document.getElementById("lista-favoritos");
    const favoritos = await buscarFavoritos();
    atualizarContadorFavoritos(favoritos.length);
    if (!lista) return;
    if (!favoritos.length) {
        lista.innerHTML = "<p>Nenhum produto favoritado.</p>";
        return;
    }
    lista.innerHTML = favoritos.map(produto => `
        <div class="produto">
            ${produto.imagem ? `<img src="${produto.imagem}" alt="">` : ""}
            <h3>${String(produto.nome).replace(/[&<>"']/g, "")}</h3>
            <p>R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}</p>
        </div>
    `).join("");
    lista.querySelectorAll(".produto").forEach(produto => produto.classList.add("aparecer"));
}

async function sincronizarBotoesFavoritos() {
    const favoritos = await buscarFavoritos();
    const ids = new Set(favoritos.map(produto => Number(produto.produtoId)));
    document.querySelectorAll(".btn-favorito[data-nome]").forEach(botao => {
        const salvo = ids.has(Number(botao.dataset.produtoId))
            || favoritos.some(produto => produto.nome === botao.dataset.nome);
        aplicarEstadoBotao(botao, salvo);
    });
    atualizarContadorFavoritos(favoritos.length);
}

document.addEventListener("DOMContentLoaded", () => {
    carregarFavoritos();
    sincronizarBotoesFavoritos();
});

document.addEventListener("click", event => {
    const botao = event.target.closest(".btn-favorito");
    if (botao) favoritarProduto(botao, botao.dataset.nome, Number(botao.dataset.preco), botao.dataset.imagem);
});