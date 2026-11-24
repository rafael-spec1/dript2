function abrirOverlay() {
        let overlay = document.getElementById("overlay");
        if (overlay) overlay.style.display = "flex";
}

function fecharOverlay() {
        let overlay = document.getElementById("overlay");
        if (overlay) overlay.style.display = "none";
}

window.addEventListener("load", () => {
        if (!document.getElementById("overlay")) return;

        setTimeout(() => {
                abrirOverlay();
        }, 500);
});

function filtrarProdutos(categoria) {
        let produtos = document.querySelectorAll(".produto");

        produtos.forEach(produto => {
                if (categoria === "todos" || produto.dataset.categoria === categoria) {
                        produto.style.display = "block";
                } else {
                        produto.style.display = "none";
                }
        });

        let secao = document.querySelector(".produtos");
        if (secao) secao.scrollIntoView({ behavior: "smooth" });
}

function renderizarProdutosHome() {
        const grid = document.getElementById("grid-produtos");

        if (!grid || typeof PRODUTOS === "undefined") return;

        let html = "";

        Object.values(PRODUTOS).forEach(produto => {
                const nome = String(produto.nome ?? "");
                const imagem = String(produto.imagem ?? "");
                const preco = Number(produto.preco) || 0;
                const id = Number(produto.id);

                const linkProduto = `http://localhost/dript2/html/produto.php?id=${id}`;
                console.log("LINK DO PRODUTO:", linkProduto);
                html += `
            <div class="produto"
                data-categoria="${produto.categoria}"
                onclick="window.location.href='${linkProduto}'">

                <span class="tag-produto">LIMITED</span>

                <a href="${linkProduto}" class="link-produto"
                    onclick="event.stopPropagation()">

                    <img src="${imagem}" alt="${nome}">

                    <h3 class="nome-produto">${nome}</h3>

                    <p>R$ ${preco.toFixed(2).replace(".", ",")}</p>
                </a>

                <div class="acoes-produto">

                    <button
                        type="button"
                        class="btn-comprar"
                        onclick="event.stopPropagation(); window.location.href='${linkProduto}'">
                        Comprar
                    </button>

                    <button
                        type="button"
                        class="btn-favorito"
                        data-produto-id="${id}"
                        data-nome="${nome}"
                        data-preco="${preco}"
                        data-imagem="${imagem}"
                        onclick="event.stopPropagation(); favoritarProduto(this, this.dataset.nome, Number(this.dataset.preco), this.dataset.imagem)">
                        🤍
                    </button>

                </div>
            </div>
        `;
        });

        grid.innerHTML = html;
}



function ativarEfeitosProdutos() {
        let produtos = document.querySelectorAll(".produto");

        const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                        if (entry.isIntersecting) {
                                entry.target.classList.add("aparecer");
                        }
                });
        });

        produtos.forEach(produto => {
                observer.observe(produto);

                produto.addEventListener("mousemove", (e) => {
                        const rect = produto.getBoundingClientRect();
                        produto.style.setProperty("--x", `${e.clientX - rect.left}px`);
                        produto.style.setProperty("--y", `${e.clientY - rect.top}px`);
                });
        });
}

document.addEventListener("DOMContentLoaded", () => {
        renderizarProdutosHome();
});




function abrirPesquisa() {

        const barra = document.getElementById("barra-pesquisa");
        const campo = document.getElementById("campo-pesquisa");

        barra.classList.add("ativa");

        campo.focus();
}


function fecharPesquisa() {

        const barra = document.getElementById("barra-pesquisa");

        barra.classList.remove("ativa");

}

function pesquisarProdutos() {

        const busca = document
                .getElementById("campo-pesquisa")
                .value
                .toLowerCase()
                .trim();

        const produtos = document.querySelectorAll("#grid-produtos .produto");
        const resultados = document.getElementById("resultados-pesquisa");

        resultados.innerHTML = "";

        produtos.forEach(produto => {

                const nome = produto
                        .querySelector("h3")
                        ?.innerText
                        .toLowerCase() || "";

                if (nome.includes(busca)) {
                        const copia = produto.cloneNode(true);
                        resultados.appendChild(copia);
                }

        });
}

document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
                fecharPesquisa();
        }

}); 