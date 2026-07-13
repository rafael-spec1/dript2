let contadorCarrinho = 0;
let totalCarrinho = 0;

function abrirCarrinho() {

    document
        .getElementById("carrinho")
        .classList.add("ativo");

}

function fecharCarrinho() {

    document
        .getElementById("carrinho")
        .classList.remove("ativo");

}

function adicionarCarrinho(nome, preco) {

    let areaCarrinho =
        document.getElementById("itens-carrinho");

    areaCarrinho.innerHTML += `
    <div class="item-carrinho">
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

    contadorCarrinho++;

    document.getElementById("contador").innerText = contadorCarrinho;

    totalCarrinho += preco * quantidade;

    document.getElementById("total-carrinho").innerText =
        `Total: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;

    quantidade = 1;

    document.getElementById("qtd").innerText = quantidade;

    localStorage.setItem("carrinho", areaCarrinho.innerHTML);
    localStorage.setItem("total", totalCarrinho);
    localStorage.setItem("contador", contadorCarrinho);

}

function removerItem(botao, preco, quantidade) {
    let item = botao.closest(".item-carrinho");
    item.remove();

    contadorCarrinho--;

    document.getElementById("contador").innerText =
        contadorCarrinho;

    totalCarrinho -= preco * quantidade;

    document.getElementById("total-carrinho").innerText =
        `Total: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;

    localStorage.setItem(
        "carrinho",
        document.getElementById("itens-carrinho").innerHTML
    );

    localStorage.setItem("total", totalCarrinho);
    localStorage.setItem("contador", contadorCarrinho);
}