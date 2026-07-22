let contadorCarrinho = 0;
let totalCarrinho = 0;

function abrirCarrinho() {
    document.getElementById("carrinho").classList.add("ativo");
}

function fecharCarrinho() {
    document.getElementById("carrinho").classList.remove("ativo");
}

function adicionarCarrinho(nome, preco, imagem) {

    let areaCarrinho = document.getElementById("itens-carrinho");

    areaCarrinho.innerHTML += `
    <div class="item-carrinho">

    <img src="${imagem}" alt="${nome}">

    <div>
        <h3>${nome}</h3>
        <p>Tamanho: ${tamanhoSelecionado}</p>
        <p>Qtd: ${quantidade}</p>
        <p>R$ ${(preco * quantidade).toFixed(2).replace(".", ",")}</p>
    </div>

        <button class="btn-remover"
        onclick="removerItem(this, ${preco}, ${quantidade})">
            ✖
        </button>

    </div>
    `;

    contadorCarrinho += quantidade;
    document.getElementById("contador").innerText = contadorCarrinho;

    totalCarrinho += preco * quantidade;
    document.getElementById("total-carrinho").innerText =
        `Total: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;

    quantidade = 1;
    let qtdEl = document.getElementById("qtd");
    if (qtdEl) qtdEl.innerText = quantidade;

    salvarCarrinho();
    abrirCarrinho();
}

function removerItem(botao, preco, quantidade) {
    let item = botao.closest(".item-carrinho");
    item.remove();

    contadorCarrinho--;
    document.getElementById("contador").innerText = contadorCarrinho;

    totalCarrinho -= preco * quantidade;
    document.getElementById("total-carrinho").innerText =
        `Total: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;

    salvarCarrinho();
}

function limparCarrinho() {
    document.getElementById("itens-carrinho").innerHTML = "";

    contadorCarrinho = 0;
    totalCarrinho = 0;

    document.getElementById("contador").innerText = contadorCarrinho;
    document.getElementById("total-carrinho").innerText = "Total: R$ 0,00";

    salvarCarrinho();
}

function finalizarCompra() {
    if (contadorCarrinho === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    window.location.href = "checkout.html";
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", document.getElementById("itens-carrinho").innerHTML);
    localStorage.setItem("total", totalCarrinho);
    localStorage.setItem("contador", contadorCarrinho);
}

// restaura o carrinho salvo ao carregar qualquer página que tenha o carrinho lateral
document.addEventListener("DOMContentLoaded", () => {
    let areaCarrinho = document.getElementById("itens-carrinho");
    if (!areaCarrinho) return;

    let carrinhoSalvo = localStorage.getItem("carrinho");
    let totalSalvo = localStorage.getItem("total");
    let contadorSalvo = localStorage.getItem("contador");

    if (carrinhoSalvo) {
        areaCarrinho.innerHTML = carrinhoSalvo;
    }

    totalCarrinho = totalSalvo ? Number(totalSalvo) : 0;
    contadorCarrinho = contadorSalvo ? Number(contadorSalvo) : 0;

    document.getElementById("contador").innerText = contadorCarrinho;
    document.getElementById("total-carrinho").innerText =
        `Total: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;
});