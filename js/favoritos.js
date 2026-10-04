function favoritosLocais() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    return Array.isArray(favoritos) ? favoritos : [];
}

function atualizarContadorFavoritos(total = favoritosLocais().length) {
    const contador = document.getElementById("contador-favoritos");

    if (contador) {
        contador.innerText = total;
    }
}

function aplicarEstadoBotao(botao, favoritado) {
    botao.innerHTML = favoritado ? "❤️" : "🤍";
    botao.classList.toggle("favoritado", favoritado);
}

// Adiciona ou remove um favorito
async function favoritarProduto(botao, nome, preco, imagem) {
    const produtoId = Number(botao.dataset.produtoId);

    if (produtoId) {
        try {
            const resposta = await fetch("../php/favoritos.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    produto_id: produtoId
                })
            });

            const retorno = await resposta.json();

            if (resposta.status !== 401) {
                if (!resposta.ok) {
                    throw new Error(
                        retorno.mensagem || "Não foi possível salvar o favorito."
                    );
                }

                aplicarEstadoBotao(botao, retorno.favoritado);
                atualizarContadorFavoritos(retorno.total);

                if (document.getElementById("lista-favoritos")) {
                    carregarFavoritos();
                }

                return;
            }

        } catch (erro) {
            alert(erro.message);
            return;
        }
    }

    // Favoritos de usuário não logado
    const favoritos = favoritosLocais();

    const indice = favoritos.findIndex(produto =>
        produto.produtoId === produtoId ||
        produto.nome === nome
    );

    if (indice >= 0) {
        favoritos.splice(indice, 1);
        aplicarEstadoBotao(botao, false);
    } else {
        favoritos.push({
            produtoId,
            nome,
            preco,
            imagem
        });

        aplicarEstadoBotao(botao, true);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    atualizarContadorFavoritos(favoritos.length);

    if (document.getElementById("lista-favoritos")) {
        carregarFavoritos();
    }
}

// Busca favoritos
async function buscarFavoritos() {
    try {
        const resposta = await fetch("../php/favoritos.php");

        if (resposta.status === 401) {
            return favoritosLocais();
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os favoritos.");
        }

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

// Carrega a página de favoritos
async function carregarFavoritos() {
    const lista = document.getElementById("lista-favoritos");

    if (!lista) return;

    const favoritos = await buscarFavoritos();

    atualizarContadorFavoritos(favoritos.length);

    // Nenhum favorito
    if (!favoritos.length) {
        lista.innerHTML = `
            <div class="favoritos-vazio">

                <div class="vazio-icone">
                    ♡
                </div>

                <span>YOUR DRIP</span>

                <h2>SEUS FAVORITOS ESTÃO VAZIOS</h2>

                <p>
                    Você ainda não salvou nenhuma peça.
                    Explore nossa coleção e encontre seu próximo drip.
                </p>

                <a href="index.php#grid-produtos" class="btn-ver-produtos">
                    VER PRODUTOS
                </a>

            </div>
        `;

        return;
    }

    // Mostra os produtos favoritos
    lista.innerHTML = favoritos.map(produto => `
        <article class="favorito-card">

            <div class="favorito-imagem">

                <button
                    class="btn-remover-favorito"
                    data-produto-id="${produto.produtoId}"
                    title="Remover dos favoritos"
                >
                    ❤️
                </button>

                <img
                    src="${produto.imagem}"
                    alt="${String(produto.nome).replace(/[&<>"']/g, "")}"
                >

            </div>

            <div class="favorito-info">

                <h3>
                    ${String(produto.nome).replace(/[&<>"']/g, "")}
                </h3>

                <strong>
                    R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}
                </strong>

                <div class="favorito-acoes">

                    <a
                        href="produto.php?id=${produto.produtoId}"
                        class="btn-ver-produto"
                    >
                        VER PRODUTO
                    </a>

                    <button
                        class="btn-comprar-favorito"
                        data-produto-id="${produto.produtoId}"
                    >
                        COMPRAR
                    </button>

                </div>

            </div>

        </article>
    `).join("");
}

// Remove favorito diretamente da página
async function removerFavorito(produtoId) {
    const botao = document.querySelector(
        `.btn-remover-favorito[data-produto-id="${produtoId}"]`
    );

    if (!botao) return;

    await favoritarProduto(
        botao,
        "",
        0,
        ""
    );
}

// Sincroniza os corações das outras páginas
async function sincronizarBotoesFavoritos() {
    const favoritos = await buscarFavoritos();

    const ids = new Set(
        favoritos.map(produto => Number(produto.produtoId))
    );

    document
        .querySelectorAll(".btn-favorito[data-nome]")
        .forEach(botao => {

            const salvo =
                ids.has(Number(botao.dataset.produtoId)) ||
                favoritos.some(produto =>
                    produto.nome === botao.dataset.nome
                );

            aplicarEstadoBotao(botao, salvo);
        });

    atualizarContadorFavoritos(favoritos.length);
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    carregarFavoritos();
    sincronizarBotoesFavoritos();
});

document.addEventListener("click", event => {

    const botaoFavorito = event.target.closest(".btn-favorito");

    if (botaoFavorito) {
        favoritarProduto(
            botaoFavorito,
            botaoFavorito.dataset.nome,
            Number(botaoFavorito.dataset.preco),
            botaoFavorito.dataset.imagem
        );
    }

    const botaoRemover = event.target.closest(".btn-remover-favorito");

    if (botaoRemover) {
        removerFavorito(
            Number(botaoRemover.dataset.produtoId)
        );
    }

    const botaoComprar = event.target.closest(".btn-comprar-favorito");

    if (botaoComprar) {
        const id = Number(botaoComprar.dataset.produtoId);

        localStorage.setItem("produtoSelecionado", id);

        window.location.href = `produto.php?id=${id}`;
    }
});