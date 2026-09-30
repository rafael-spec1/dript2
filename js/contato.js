const formulario = document.getElementById("form-contato");
const mensagemSucesso = document.getElementById("mensagem-sucesso");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const dados = Object.fromEntries(new FormData(formulario));

    fetch("../php/contatos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
        .then(async resposta => {
            const retorno = await resposta.json();
            if (!resposta.ok) throw new Error(retorno.mensagem || "Não foi possível enviar sua mensagem.");
            mensagemSucesso.classList.add("ativo");
            formulario.reset();
        })
        .catch(erro => alert(erro.message));
});

function fecharMensagem() {
    mensagemSucesso.classList.remove("ativo");
}