let quantidade = 1;
let tamanhoSelecionado = "M";

function aumentarQtd() {

    quantidade++;

    document.getElementById("qtd").innerText = quantidade;

}

function diminuirQtd() {

    if (quantidade > 1) {

        quantidade--;

        document.getElementById("qtd").innerText = quantidade;

    }

}

function selecionarTamanho(botao) {

    let botoes = document.querySelectorAll(".opcoes-tamanho button");

    botoes.forEach(btn => {

        btn.classList.remove("ativo");

    });

    botao.classList.add("ativo");

    tamanhoSelecionado = botao.innerText;

}