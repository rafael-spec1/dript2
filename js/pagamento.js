const opcoesPagamento = document.querySelectorAll(
    'input[name="pagamento"]'
);

const dadosCartao = document.getElementById("dados-cartao");
const dadosPix = document.getElementById("dados-pix");
const dadosBoleto = document.getElementById("dados-boleto");


opcoesPagamento.forEach(opcao => {

    opcao.addEventListener("change", function () {

        dadosCartao.style.display = "none";
        dadosPix.style.display = "none";
        dadosBoleto.style.display = "none";


        if (this.value === "cartao") {
            dadosCartao.style.display = "block";
        }

        if (this.value === "pix") {
            dadosPix.style.display = "block";
        }

        if (this.value === "boleto") {
            dadosBoleto.style.display = "block";
        }

    });

});

const listaPedido = document.getElementById("lista-pedido");
const totalPedido = document.getElementById("total-pedido");

const carrinhoSalvo = localStorage.getItem("carrinho");
const totalSalvo = localStorage.getItem("total");

if (totalSalvo) {
    totalPedido.textContent =
        `R$ ${Number(totalSalvo).toFixed(2).replace(".", ",")}`;
} else {
    totalPedido.textContent = "R$ 0,00";
}

if (carrinhoSalvo) {
    listaPedido.innerHTML = carrinhoSalvo;

    document.querySelectorAll("#lista-pedido .item-carrinho").forEach(item => {
        item.insertAdjacentHTML(
            "beforeend",
            `<button class="btn-remover-checkout" onclick="removerDoCheckout(this)">
                REMOVER
            </button>`
        );
    });
}

function removerDoCheckout(botao) {
    const item = botao.closest(".item-carrinho");

    if (!item) return;

    item.remove();

    const itensRestantes = document.querySelectorAll(
        "#lista-pedido .item-carrinho"
    );

    let total = 0;
    let contador = 0;

    itensRestantes.forEach(item => {
        const paragrafos = item.querySelectorAll("p");

        paragrafos.forEach(p => {
            const texto = p.innerText;

            if (texto.includes("Qtd:")) {
                const qtd = Number(
                    texto.replace("Qtd:", "").trim()
                );

                contador += qtd;
            }

            if (texto.includes("R$")) {
                const valor = Number(
                    texto
                        .replace("R$", "")
                        .trim()
                        .replace(/\./g, "")
                        .replace(",", ".")
                );

                total += valor;
            }
        });
    });

    localStorage.setItem(
        "carrinho",
        document.getElementById("lista-pedido").innerHTML
    );

    localStorage.setItem("total", total);
    localStorage.setItem("contador", contador);

    totalPedido.textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;
}