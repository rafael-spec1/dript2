function abrirOverlay() {
        document.getElementById("overlay").style.display = "flex";
}

function fecharOverlay() {
        document.getElementById("overlay").style.display = "none";
}

function filtrarProdutos(categoria) {
        let produtos = document.querySelectorAll(".produto");

        produtos.forEach(produto => {
                if (
                        categoria === "todos" ||
                        produto.dataset.categoria === categoria
                ) {
                        produto.style.display = "block";
                } else {
                        produto.style.display = "none";
                }
        });
}

const produtos = document.querySelectorAll(".produto");

const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
                if (entry.isIntersecting) {
                        entry.target.classList.add("aparecer");
                }
        });
});

produtos.forEach(produto => {
        observer.observe(produto);
});

document.querySelectorAll(".produto").forEach(card => {

        card.addEventListener("mousemove", (e) => {

                const rect = card.getBoundingClientRect();

                card.style.setProperty("--x", `${e.clientX - rect.left}px`);
                card.style.setProperty("--y", `${e.clientY - rect.top}px`);

        });

});