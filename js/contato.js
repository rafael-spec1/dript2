const formulario = document.getElementById("form-contato");
const mensagemSucesso = document.getElementById("mensagem-sucesso");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    mensagemSucesso.classList.add("ativo");

    formulario.reset();
});

function fecharMensagem() {
    mensagemSucesso.classList.remove("ativo");
}