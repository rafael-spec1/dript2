
function favoritarProduto(botao, nome, preco, imagem) {

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (!Array.isArray(favoritos)) {
        favoritos = [];
    }

    const indice = favoritos.findIndex(produto => produto.nome === nome);

    if (indice !== -1) {

        favoritos.splice(indice, 1);

        botao.innerHTML = "🤍";

        botao.classList.remove("favoritado");

    } else {

        favoritos.push({

            nome: nome,
            preco: preco,
            imagem: imagem

        });

        botao.innerHTML = "❤️";

        botao.classList.add("favoritado");

    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    atualizarContadorFavoritos();

}



// CONTADOR

function atualizarContadorFavoritos() {

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    const contador = document.getElementById("contador-favoritos");

    if (contador) {

        contador.innerText = favoritos.length;

    }

}



// CARREGAR FAVORITOS

function carregarFavoritos() {

    const lista = document.getElementById("lista-favoritos");

    if (!lista) return;

    lista.innerHTML = "";

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    console.log(favoritos);
    if (favoritos.length === 0) {

        lista.innerHTML = "<p>Nenhum produto favoritado.</p>";

        return;

    }

    favoritos.forEach(produto => {

        lista.innerHTML += `

        <div class="produto">

            ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}">` : `<div class="sem-imagem">📷<br>Imagem pendente</div>`}

            <h3>${produto.nome}</h3>

            <p>R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}</p>

        </div>

        `;

    });
    document.querySelectorAll("#lista-favoritos .produto").forEach(produto => {
        produto.classList.add("aparecer");
    });
}

document.addEventListener("DOMContentLoaded", carregarFavoritos);




function sincronizarBotoesFavoritos() {

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (!Array.isArray(favoritos)) {
        favoritos = [];
    }

    document.querySelectorAll(".btn-favorito[data-nome]").forEach(botao => {

        const favoritado = favoritos.some(p => p.nome === botao.dataset.nome);

        botao.innerHTML = favoritado ? "❤️" : "🤍";
        botao.classList.toggle("favoritado", favoritado);

    });

}




document.addEventListener("DOMContentLoaded", () => {

    atualizarContadorFavoritos();

    carregarFavoritos();

});

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("btn-favorito")) {

        const botao = e.target;

        favoritarProduto(
            botao,
            botao.dataset.nome,
            Number(botao.dataset.preco),
            botao.dataset.imagem
        );

    }

});