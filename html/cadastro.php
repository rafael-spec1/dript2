<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar conta | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/senha.css">
</head>

<body class="pagina-cadastro">

    <!-- Cadastro -->

    <main class="cadastro">

        <a href="index.php" class="cadastro-logo">
            DRIPT<span>.</span>
        </a>

        <div class="cadastro-box">

            <div class="cadastro-topo">

                <span>JOIN THE DRIP</span>

                <h1>Crie sua conta</h1>

                <p>
                    Faça parte da DRIPT e acompanhe nossos próximos drops.
                </p>

            </div>

            <!-- Formulário -->

            <form id="form-cadastro">

                <div class="campo">

                    <label for="nome">
                        Nome completo
                    </label>

                    <input
                        type="text"
                        id="nome"
                        placeholder="Digite seu nome completo"
                        required
                    >

                </div>

                <div class="campo">

                    <label for="email">
                        E-mail
                    </label>

                    <input
                        type="email"
                        id="email"
                        placeholder="seuemail@email.com"
                        required
                    >

                </div>

                <div class="campo">

                    <label for="senha">
                        Senha
                    </label>

                    <input
                        type="password"
                        id="senha"
                        placeholder="Crie uma senha"
                        required
                    >

                </div>

                <div class="campo">

<div class="seguranca-senha">

    <div class="senha-info">
        <span>SEGURANÇA DA SENHA</span>
        <span id="textoForca">Digite uma senha</span>
    </div>

    <div class="senha-trilho">
        <div id="barraForca"></div>
    </div>

    <div class="senha-requisitos">

        <span id="reqTamanho">✕ 8 caracteres</span>
        <span id="reqMaiuscula">✕ Letra maiúscula</span>
        <span id="reqNumero">✕ Número</span>
        <span id="reqEspecial">✕ Caractere especial</span>

    </div>

</div>

                    <label for="confirmarSenha">
                        Confirmar senha
                    </label>

                    <input
                        type="password"
                        id="confirmarSenha"
                        placeholder="Digite sua senha novamente"
                        required
                    >

                </div>

                <label class="termos">
    <input type="checkbox" id="aceitarTermos">
    <span>
        Li e aceito os
        <a href="#" id="abrirTermos">Termos e Condições</a>
        da DRIPT.
    </span>
</label>

<div class="modal-termos" id="modalTermos">
    <div class="caixa-termos">
        <button type="button" class="fechar-termos" id="fecharTermos">×</button>

        <h2>TERMOS E CONDIÇÕES</h2>
        <p>Bem-vindo à DRIPT! Ao criar uma conta, você concorda com as condições apresentadas abaixo.</p>

        <h3>1. Cadastro</h3>
        <p>O usuário deve fornecer informações verdadeiras e manter seus dados atualizados.</p>

        <h3>2. Segurança da conta</h3>
        <p>O usuário é responsável por manter sua senha em segurança e não compartilhá-la com terceiros.</p>

        <h3>3. Privacidade</h3>
        <p>Os dados pessoais fornecidos serão utilizados para o funcionamento da conta e atendimento ao cliente, respeitando a legislação de proteção de dados.</p>

        <h3>4. Compras</h3>
        <p>As informações sobre produtos, preços e condições de compra devem ser consultadas no próprio site.</p>

        <h3>5. Disposições gerais</h3>
        <p>A utilização dos serviços da DRIPT implica o conhecimento e a aceitação destas condições.</p>

        <button type="button" class="btn-fechar-termos" id="confirmarTermos">ENTENDI</button>
    </div>
</div>

                </label>

                <button
                    type="submit"
                    class="btn-cadastro"
                >
                    CRIAR CONTA
                </button>

            </form>

            <div class="cadastro-login">

                <span>
                    Já possui uma conta?
                </span>

                <a href="login.php">
                    Entrar
                </a>

            </div>

            <p class="cadastro-privacidade">
                Seus dados são utilizados apenas para sua conta DRIPT.
            </p>

        </div>

    </main>

    <!-- Cadastro via PHP -->

    <script>

        // Barra de força da senha

const campoSenha = document.getElementById("senha");
const barraForca = document.getElementById("barraForca");
const textoForca = document.getElementById("textoForca");

const requisitos = {
    tamanho: document.getElementById("reqTamanho"),
    maiuscula: document.getElementById("reqMaiuscula"),
    numero: document.getElementById("reqNumero"),
    especial: document.getElementById("reqEspecial")
};

campoSenha.addEventListener("input", function() {

    const senha = campoSenha.value;

    const verificacoes = [
        senha.length >= 8,
        /[A-Z]/.test(senha),
        /[0-9]/.test(senha),
        /[^A-Za-z0-9]/.test(senha)
    ];

    const elementos = Object.values(requisitos);

    let forca = verificacoes.filter(Boolean).length;

    elementos.forEach((elemento, indice) => {
        elemento.classList.toggle("validado", verificacoes[indice]);

        const textos = [
            "8 caracteres",
            "Letra maiúscula",
            "Número",
            "Caractere especial"
        ];

        elemento.textContent =
            (verificacoes[indice] ? "✓ " : "✕ ") + textos[indice];
    });

    const niveis = [
        { largura: "0%", texto: "Digite uma senha", cor: "transparent" },
        { largura: "25%", texto: "Muito fraca", cor: "#e74c3c" },
        { largura: "50%", texto: "Média", cor: "#f39c12" },
        { largura: "75%", texto: "Boa", cor: "#3498db" },
        { largura: "100%", texto: "Forte", cor: "#2ecc71" }
    ];

    barraForca.style.width = niveis[forca].largura;
    barraForca.style.background = niveis[forca].cor;
    barraForca.style.color = niveis[forca].cor;
    textoForca.textContent = niveis[forca].texto;
    textoForca.style.color = niveis[forca].cor;

});

// Mostrar e esconder senha

document.querySelectorAll(".olho-senha").forEach(botao => {

    botao.addEventListener("click", function() {

        const campo = document.getElementById(
            this.dataset.target
        );

        const olho = this.querySelector(".olho");

        if (campo.type === "password") {
            campo.type = "text";
            olho.textContent = "🙈";
        } else {
            campo.type = "password";
            olho.textContent = "👁";
        }

    });

});

        // Cadastro

        document
            .getElementById("form-cadastro")
            .addEventListener("submit", function(event) {

                event.preventDefault();

                const nome =
                    document.getElementById("nome").value.trim();

                const email =
                    document.getElementById("email").value.trim();

                const senha =
                    document.getElementById("senha").value;

                const confirmarSenha =
                    document.getElementById("confirmarSenha").value;

                const termos =
                    document.getElementById("aceitarTermos").checked;

                // Verifica as senhas

                if (senha !== confirmarSenha) {

                    alert("As senhas não coincidem.");
                    return;

                }

                // Verifica os termos

                if (!termos) {

                    alert(
                        "Aceite os termos e condições para continuar."
                    );

                    return;

                }

                // Envia os dados para o PHP

                fetch("../php/salvar.php", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nome,
                        email,
                        senha,
                        confirmarSenha,
                        aceitarTermos: termos
                    })

                })

                .then(async resposta => {

                    const dados =
                        await resposta.json();

                    if (!resposta.ok) {

                        throw new Error(
                            dados.mensagem ||
                            "Não foi possível criar a conta."
                        );

                    }

                    // Após cadastrar, abre a conta

                    window.location.href =
                        "conta.php";

                })

                .catch(erro => {

                    alert(erro.message);

                });

            });

    </script>

</body>
</html>
