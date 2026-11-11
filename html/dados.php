`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meus Dados | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/conta.css">
</head>

<body class="pagina-cadastro">

    <main class="cadastro">

        <a href="index.php" class="cadastro-logo">
            DRIPT<span>.</span>
        </a>

        <div class="conta-box">

            <div class="cadastro-topo">
                <span>MY DRIPT</span>

                <h1>Meus dados</h1>

                <p>
                    Confira as informações da sua conta.
                </p>
            </div>

            <div class="dados-usuario">

                <div class="campo">
                    <label for="nome">NOME</label>
                    <input type="text" id="nome" readonly>
                </div>

                <div class="campo">
                    <label for="email">EMAIL</label>
                    <input type="email" id="email" readonly>
                </div>

            </div>

            <a href="conta.php" class="btn-sobre">
                VOLTAR PARA MINHA CONTA
            </a>

        </div>

    </main>

    <script>
        // Carrega os dados da sessão do usuário
        fetch("../php/sessao.php")
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error("Sessão não encontrada.");
                }

                return resposta.json();
            })
            .then(usuario => {
                document.getElementById("nome").value = usuario.nome || "";
                document.getElementById("email").value = usuario.email || "";
            })
            .catch(() => {
                window.location.href = "login.php";
            });
    </script>

</body>
</html>