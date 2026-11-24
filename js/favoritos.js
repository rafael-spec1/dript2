function favoritosLocais() {
    const favoritos = JSON.parse(
        localStorage.getItem("favoritos")
    ) || [];

    return Array.isArray(favoritos) ? favoritos : [];
}


// Protege textos inseridos no HTML
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}


// Ícone SVG de coração
function iconeCoracao(favoritado = true) {
    return `
        <svg
            viewBox="0 0 24 24"
            fill="${favoritado ? 'currentColor' : 'none'}"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>
        </svg>
    `;
}


// Atualiza o visual do botão de favorito
function aplicarEstadoBotao(botao, favoritado) {
    if (!botao) return;

    botao.innerHTML = iconeCoracao(favoritado);

    botao.classList.toggle("favoritado", favoritado);

    botao.setAttribute(
        "aria-pressed",
        String(favoritado)
    );
}


// Atualiza o contador
function atualizarContadorFavoritos(total = favoritosLocais().length) {
    const contador = document.getElementById("contador-favoritos");

    if (contador) {
        contador.innerText = total;
    }
}


// ==========================================
// ADICIONAR OU REMOVER FAVORITOS
// ==========================================

async function favoritarProduto(botao, nome, preco, imagem) {
    const produtoId = Number(botao.dataset.produtoId);

    if (!produtoId) return;

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

        if (resposta.status !== 401) {
            const retorno = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    retorno.mensagem || "Não foi possível atualizar os favoritos."
                );
            }

            aplicarEstadoBotao(botao, retorno.favoritado);
            atualizarContadorFavoritos(retorno.total);

            if (document.getElementById("lista-favoritos")) {
                await carregarFavoritos();
            }

            return;
        }

    } catch (erro) {
        alert(erro.message);
        return;
    }

    // Usuário não autenticado: armazenamento local
    const favoritos = favoritosLocais();

    const indice = favoritos.findIndex(produto =>
        Number(produto.produtoId) === produtoId ||
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

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    atualizarContadorFavoritos(favoritos.length);

    if (document.getElementById("lista-favoritos")) {
        await carregarFavoritos();
    }
}


// ==========================================
// BUSCAR FAVORITOS
// ==========================================

async function buscarFavoritos() {
    try {
        const resposta = await fetch("/dript2/php/favoritos.php", {
            credentials: "same-origin",
            cache: "no-store"
        });

        if (resposta.status === 401) {
            return favoritosLocais();
        }

        if (!resposta.ok) {
            throw new Error("Erro ao buscar favoritos.");
        }

        const dados = await resposta.json();

        return dados.map(produto => ({
            produtoId: Number(produto.produto_id),
            nome: produto.nome,
            preco: Number(produto.preco_centavos) / 100,
            imagem: produto.imagem
        }));

    } catch (erro) {
        return favoritosLocais();
    }
}


// ==========================================
// ESTADO VAZIO
// ==========================================

function mostrarFavoritosVazios(lista) {
    lista.innerHTML = `
        <div class="favoritos-vazio">

            <div class="vazio-icone">
                ${iconeCoracao(false)}
            </div>

            <span>DRIPT COLLECTION</span>

            <h2>NENHUMA PEÇA SALVA</h2>

            <p>
                Seu próximo drip pode estar esperando por você.
                Explore nossa coleção e salve suas peças favoritas.
            </p>

            <a
                href="index.php#grid-produtos"
                class="btn-ver-produtos"
            >
                EXPLORAR COLEÇÃO
            </a>

        </div>
    `;
}


// ==========================================
// CARREGAR PRODUTOS FAVORITOS
// ==========================================

async function carregarFavoritos() {
    const lista = document.getElementById("lista-favoritos");

    if (!lista) return;

    const favoritos = await buscarFavoritos();

    atualizarContadorFavoritos(favoritos.length);

    if (!favoritos.length) {
        mostrarFavoritosVazios(lista);
        return;
    }

    lista.innerHTML = favoritos.map(produto => {

        const id = Number(produto.produtoId);
        const nome = escaparHTML(produto.nome);
        const imagem = escaparHTML(produto.imagem);

        const preco = Number(produto.preco)
            .toFixed(2)
            .replace(".", ",");

        return `
            <article class="favorito-card" data-produto-id="${id}">

                <div class="favorito-imagem">

                    <button
                        type="button"
                        class="btn-remover-favorito favoritado"
                        data-produto-id="${id}"
                        aria-label="Remover ${nome} dos favoritos"
                        title="Remover dos favoritos"
                    >
                        ${iconeCoracao(true)}
                    </button>

                    <img
                        src="${imagem}"
                        alt="${nome}"
                        loading="lazy"
                    >

                </div>

                <div class="favorito-info">

                    <h3>${nome}</h3>

                    <strong>R$ ${preco}</strong>

                    <div class="favorito-acoes">

                        <a
                            href="produto.php?id=${id}"
                            class="btn-ver-produto"
                        >
                            VER PRODUTO
                        </a>

                        <button
                            type="button"
                            class="btn-comprar-favorito"
                            data-produto-id="${id}"
                        >
                            COMPRAR
                        </button>

                    </div>

                </div>

            </article>
        `;

    }).join("");
}


// ==========================================
// REMOVER FAVORITO
// ==========================================

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


// SINCRONIZAR BOTÕES
// 

async function sincronizarBotoesFavoritos() {
    const favoritos = await buscarFavoritos();

    const ids = new Set(
        favoritos.map(produto => Number(produto.produtoId))
    );

    document.querySelectorAll(".btn-favorito[data-nome]")
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


//EVENTOs
//

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
