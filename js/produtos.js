const PRODUTOS = [

    {
        id: 1,
        nome: "Camiseta DRIPT",
        preco: 99.90,
        categoria: "camiseta",
        imagem: "../img/camiseta-fashion-free-black.png",
        tag: "LIMITED",
        descricao: "Camiseta oversized premium DRIPT confeccionada em algodão de alta qualidade.",
        avaliacao: 4.9
    },

    {
        id: 2,
        nome: "Moletom DRIPT",
        preco: 179.90,
        categoria: "moletom",
        imagem: "../img/moletom-dript.png",
        tag: "LIMITED",
        descricao: "Moletom premium DRIPT com tecido encorpado e modelagem streetwear.",
        avaliacao: 5.0
    },

    {
        id: 3,
        nome: "Calça DRIPT",
        preco: 199.90,
        categoria: "calca",
        imagem: "../img/calça-dript.png",
        tag: "NEW",
        descricao: "Calça larga DRIPT inspirada na cultura urbana.",
        avaliacao: 4.9
    },

    {
        id: 4,
        nome: "Moletom DRIPT",
        preco: 199.90,
        categoria: "moletom",
        imagem: "../img/moletom-dript-lax.png",
        tag: "NEW",
        descricao: "Moletom DRIPT com estilo urbano e acabamento premium.",
        avaliacao: 4.7
    },

    {
        id: 5,
        nome: "Camiseta Oversized",
        preco: 119.90,
        categoria: "camiseta",
        imagem: "../img/camisa-oversize.png",
        tag: "NEW",
        descricao: "Camiseta oversized DRIPT com visual minimalista e modelagem streetwear.",
        avaliacao: 4.9
    },

    {
        id: 6,
        nome: "Calça Jeans DRIPT",
        preco: 229.90,
        categoria: "calca",
        imagem: "../img/camiseta-fashion-free-black.png",
        tag: "NEW",
        descricao: "Calça jeans DRIPT com modelagem moderna e inspiração streetwear.",
        avaliacao: 4.8
    }

];
function carregarProdutos() {

    const grid = document.getElementById("grid-produtos");

    if (!grid) return;

    grid.innerHTML = "";

    PRODUTOS.forEach(produto => {

        grid.innerHTML += `

        <div class="produto" data-categoria="${produto.categoria}">

            <span class="tag-produto">${produto.tag}</span>

            <img src="${produto.imagem}" alt="${produto.nome}">

            <h3>${produto.nome}</h3>

            <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>

            <div class="acoes-produto">

                <button class="btn-comprar"
                onclick="abrirProduto(${produto.id})">
                    Comprar
                </button>

                <button class="btn-favorito"
                onclick="favoritarProduto(this,'${produto.nome}',${produto.preco},'${produto.imagem}')">
                    🤍
                </button>

            </div>

        </div>

        `;

    });

}

function abrirProduto(id) {

    localStorage.setItem("produtoSelecionado", id);

    window.location.href = "produto.html";

}

document.addEventListener("DOMContentLoaded", carregarProdutos);