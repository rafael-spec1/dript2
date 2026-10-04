<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Conta | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/conta.css">
</head>

<body class="pagina-cadastro">

    <!-- Minha conta -->

    <main class="cadastro">

        <a href="index.php" class="cadastro-logo">
            DRIPT<span>.</span>
        </a>

        <div class="conta-box">

            <div class="cadastro-topo">

                <span>MY DRIPT</span>

                <h1>Minha conta</h1>

                <p id="saudacao-usuario">
                    Bem-vindo de volta.
                </p>

            </div>

            <!-- Opções da conta -->

            <div class="conta-opcoes">

                <a href="favoritos.php" class="conta-item">

                    <span>♡</span>

                    <div>
                        <h3>Meus favoritos</h3>
                        <p>Veja as peças que você salvou.</p>
                    </div>

                </a>

                <a href="pedidos.php" class="conta-item">

                    <span>📦</span>

                    <div>
                        <h3>Meus pedidos</h3>
                        <p>Acompanhe suas compras.</p>
                    </div>

                </a>

                <a href="dados.php" class="conta-item">

                    <span>👤</span>

                    <div>
                        <h3>Meus dados</h3>
                        <p>Confira suas informações.</p>
                    </div>

                </a>

            </div>

            <button class="btn-sair" onclick="sair()">
                SAIR DA CONTA
            </button>

        </div>

    </main>

    <!-- Sessão -->

    <script>

        fetch("../php/sessao.php")

            .then(resposta => {

                if (!resposta.ok) {
                    throw new Error();
                }

                return resposta.json();

            })

            .then(usuario => {

                document
                    .getElementById("saudacao-usuario")
                    .innerText =
                    `Olá, ${usuario.nome.split(" ")[0]}. Bem-vindo à DRIPT.`;

            })

            .catch(() => {

                window.location.href = "login.php";

            });


        // Encerra a sessão

        function sair() {

            fetch("../php/sessao.php", {
                method: "DELETE"
            })

            .finally(() => {

                window.location.href = "index.php";

            });

        }

    </script>

</body>

</html>