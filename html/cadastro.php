<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar conta | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
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
                        placeholder="Digite seu nome"
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

                    <input
                        type="checkbox"
                        id="aceitarTermos"
                    >

                    <span>
                        Aceito os termos e condições da DRIPT.
                    </span>

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

        campoSenha.addEventListener("input", function() {

            const senha = campoSenha.value;
            let forca = 0;

            if (senha.length >= 8) forca++;
            if (/[A-Z]/.test(senha)) forca++;
            if (/[0-9]/.test(senha)) forca++;
            if (/[^A-Za-z0-9]/.test(senha)) forca++;

            const niveis = [
                { largura: "0%", texto: "Digite uma senha", cor: "transparent" },
                { largura: "25%", texto: "Senha fraca", cor: "#e74c3c" },
                { largura: "50%", texto: "Senha média", cor: "#f39c12" },
                { largura: "75%", texto: "Senha boa", cor: "#3498db" },
                { largura: "100%", texto: "Senha forte", cor: "#2ecc71" }
            ];

            barraForca.style.width = niveis[forca].largura;
            barraForca.style.backgroundColor = niveis[forca].cor;
            textoForca.textContent = niveis[forca].texto;

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
