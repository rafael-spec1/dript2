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