
<?php
session_start();

$mensagem_enviada = false;
$erro = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = trim($_POST["nome"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $assunto = trim($_POST["assunto"] ?? "");
    $mensagem = trim($_POST["mensagem"] ?? "");

    if ($nome === "" || $email === "" || $assunto === "" || $mensagem === "") {
        $erro = "Preencha todos os campos.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erro = "Digite um e-mail válido.";
    } else {
        $mensagem_enviada = true;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contato | DRIPT</title>

    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/contato.css">
</head>

<body>

    <header>
        <nav class="navbar">

            <a href="index.php" class="logo">DRIPT</a>

            <ul class="menu">
                <li><a href="index.php">INÍCIO</a></li>
                <li><a href="index.php#colecoes">COLEÇÕES</a></li>
                <li><a href="index.php#camisetas">CAMISETAS</a></li>
                <li><a href="index.php#moletons">MOLETONS</a></li>
                <li><a href="contato.php">CONTATO</a></li>
                <li><a href="sobre.php">SOBRE</a></li>
            </ul>

        </nav>
    </header>

    <main>

        <section class="contato">

            <h2>FALE CONOSCO</h2>

            <p>
                Tem alguma dúvida, sugestão ou precisa de ajuda?
                Entre em contato com a equipe DRIPT.
            </p>

            <?php if ($erro !== ""): ?>
                <p style="color: #e00000;">
                    <?= htmlspecialchars($erro) ?>
                </p>
            <?php endif; ?>

            <form method="POST" action="contato.php">

                <label for="nome">Nome</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Digite seu nome"
                    value="<?= htmlspecialchars($_POST["nome"] ?? "") ?>"
                    required
                >

                <label for="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    value="<?= htmlspecialchars($_POST["email"] ?? "") ?>"
                    required
                >

                <label for="assunto">Assunto</label>
                <input
                    type="text"
                    id="assunto"
                    name="assunto"
                    placeholder="Digite o assunto"
                    value="<?= htmlspecialchars($_POST["assunto"] ?? "") ?>"
                    required
                >

                <label for="mensagem">Mensagem</label>
                <textarea
                    id="mensagem"
                    name="mensagem"
                    placeholder="Escreva sua mensagem..."
                    required
                ><?= htmlspecialchars($_POST["mensagem"] ?? "") ?></textarea>

                <button type="submit">ENVIAR MENSAGEM</button>

            </form>

        </section>

    </main>

    <footer class="footer">

        <div class="footer-logo">
            <h2>DRIPT</h2>
            <p>Streetwear sem regras. Sem limites.</p>
        </div>

        <div>
            <h3>NAVEGAÇÃO</h3>
            <a href="index.php">Início</a>
            <a href="sobre.php">Sobre</a>
            <a href="contato.php">Contato</a>
        </div>

        <div>
            <h3>ATENDIMENTO</h3>
            <p>Entre em contato conosco.</p>
        </div>

    </footer>

    <div class="mensagem-sucesso <?= $mensagem_enviada ? 'ativo' : '' ?>" id="mensagemSucesso">

        <div class="caixa-sucesso">

            <div class="icone-sucesso">✓</div>

            <h2>Mensagem enviada!</h2>

            <p>
                Obrigado por entrar em contato com a DRIPT.
                Sua mensagem foi recebida.
            </p>

            <button type="button" onclick="fecharMensagem()">
                CONTINUAR
            </button>

        </div>

    </div>

    <script>
        function fecharMensagem() {
            document.getElementById("mensagemSucesso").classList.remove("ativo");
        }
    </script>

</body>
</html>
