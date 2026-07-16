
let quantidade = 1;

// Tamanho selecionado
let tamanhoSelecionado = "M";

// Aumentar quantidade
function aumentarQtd() {
    quantidade++;
    document.getElementById("qtd").innerText = quantidade;
}

// Diminuir quantidade
function diminuirQtd() {
    if (quantidade > 1) {
        quantidade--;
        document.getElementById("qtd").innerText = quantidade;
    }
}

// Selecionar tamanho
function selecionarTamanho(botao) {

    document.querySelectorAll(".opcoes-tamanho button").forEach(btn => {
        btn.classList.remove("ativo");
    });

    botao.classList.add("ativo");
    tamanhoSelecionado = botao.innerText;
}

// Deixa o tamanho M selecionado quando abrir a página
window.addEventListener("DOMContentLoaded", () => {

    const botaoM = [...document.querySelectorAll(".opcoes-tamanho button")]
        .find(btn => btn.innerText === "M");

    if (botaoM) {
        botaoM.classList.add("ativo");
    }

});