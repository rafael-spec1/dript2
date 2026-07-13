function favoritarProduto(botao) {

    const produto = {
        nome: "Moletom DRIPT",
        preco: "R$ 179,90",
        imagem: "../img/moletom-rio-arabe-black.png"
    };

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    const existe = favoritos.find(item => item.nome === produto.nome);

    if (existe) {

        favoritos = favoritos.filter(item => item.nome !== produto.nome);

        botao.textContent = "🤍";
        botao.classList.remove("ativo");

    } else {

        favoritos.push(produto);

        botao.textContent = "❤️";
        botao.classList.add("ativo");

    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    atualizarContadorFavoritos();
    carregarFavoritos();

}

function carregarFavoritos() {

    const lista = document.getElementById("lista-favoritos");

    if (!lista) return;

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    lista.innerHTML = "";

    if (favoritos.length === 0) {

        lista.innerHTML = "<p>Nenhum produto favoritado.</p>";
        return;

    }

    favoritos.forEach(produto => {

        lista.innerHTML += `
        <div class="produto">

            <img src="${produto.imagem}">

            <h3>${produto.nome}</h3>

            <p>${produto.preco}</p>

        </div>
        `;

    });

}

function atualizarContadorFavoritos() {

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    const contador = document.getElementById("contador-favoritos");

    if (contador) {

        contador.textContent = favoritos.length;

    }

}

document.addEventListener("DOMContentLoaded", () => {

    carregarFavoritos();
    atualizarContadorFavoritos();

});