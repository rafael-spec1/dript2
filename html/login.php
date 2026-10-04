<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entrar | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
</head>

<body class="pagina-cadastro">

    <!-- Login -->

    <main class="cadastro">

        <a href="index.php" class="cadastro-logo">
            DRIPT<span>.</span>
        </a>


        <div class="cadastro-box">

            <div class="cadastro-topo">

                <span>
                    WELCOME BACK
                </span>

                <h1>
                    Entre na sua conta
                </h1>

                <p>
                    Acesse sua conta DRIPT e continue de onde parou.
                </p>

            </div>


            <!-- Formulário -->

            <form id="form-login">

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
                        placeholder="Digite sua senha"
                        required
                    >

                </div>


                <button
                    type="submit"
                    class="btn-cadastro"
                >
                    ENTRAR NA DRIPT
                </button>

            </form>


            <div class="cadastro-login">

                <span>
                    Ainda não possui uma conta?
                </span>

                <a href="cadastro.php">
                    Criar conta
                </a>

            </div>

        </div>

    </main>


    <!-- Login via PHP -->

    <script>

        document
            .getElementById("form-login")
            .addEventListener("submit", function(event) {

                event.preventDefault();

                const email =
                    document.getElementById("email").value.trim();

                const senha =
                    document.getElementById("senha").value;


                // Envia os dados para o PHP

                fetch("../php/login.php", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        senha
                    })

                })

                .then(async resposta => {

                    const dados =
                        await resposta.json();

                    if (!resposta.ok) {

                        throw new Error(
                            dados.mensagem ||
                            "Não foi possível entrar."
                        );

                    }

                    // Após o login, abre a conta

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