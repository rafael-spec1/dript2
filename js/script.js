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
        let grid = document.getElementById("grid-produtos");
        if (!grid || typeof PRODUTOS === "undefined") return;

        let html = "";

        Object.values(PRODUTOS).forEach(produto => {
                html += `
        <div class="produto" data-categoria="${produto.categoria}">
            <span class="tag-produto">LIMITED</span>
            <a href="produto.html?id=${produto.id}" class="link-produto">
                ${htmlImagemProduto(produto, "")}
                <h3 class="nome-produto">${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
            </a>
            <div class="acoes-produto">
                <a href="produto.html?id=${produto.id}">
                    <button class="btn-comprar">Comprar</button>
                </a>
                <button class="btn-favorito" data-nome="${produto.nome}"
                    onclick="favoritarProduto(this,'${produto.nome}',${produto.preco},'${produto.imagem || ""}')">🤍</button>
            </div>
        </div>
        `;
        });

        grid.innerHTML = html;


        ativarEfeitosProdutos();

        if (typeof sincronizarBotoesFavoritos === "function") sincronizarBotoesFavoritos();
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

function carregarProdutos() {

        const grid = document.getElementById("grid-produtos");

        if (!grid) return;

        grid.innerHTML = "";

        produtos.forEach(produto => {

                grid.innerHTML += `
        
        <div class="produto" data-categoria="${produto.categoria}">

            <span class="tag-produto">${produto.tag}</span>

            <img src="${produto.imagem}" alt="${produto.nome}">

            <h3 class="nome-produto">${produto.nome}</h3>

            <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>

            <div class="acoes-produto">

                <a href="${produto.link}">

                    <button class="btn-comprar">
                        Comprar
                    </button>

                </a>

                <button class="btn-favorito">
                    🤍
                </button>

            </div>

        </div>

        `;

        });

}

document.addEventListener("DOMContentLoaded", carregarProdutos);