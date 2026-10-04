<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Meus Favoritos | DRIPT</title>

    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/favoritos.css">
</head>

<body class="pagina-favoritos">

    <!-- Navbar -->

    <nav class="navbar">

        <a href="index.php" class="logo">
            DRIPT
        </a>

        <ul class="menu">

            <li>
                <a href="index.php">INÍCIO</a>
            </li>

            <li>
                <a href="index.php#grid-produtos">COLEÇÕES</a>
            </li>

            <li>
                <a href="index.php">CAMISETAS</a>
            </li>

            <li>
                <a href="index.php">MOLETONS</a>
            </li>

            <li>
                <a href="contato.php">CONTATO</a>
            </li>

            <li>
                <a href="sobre.php">SOBRE</a>
            </li>

        </ul>

    </nav>

    <!-- Favoritos -->

    <main class="favoritos-container">

        <header class="favoritos-topo">

            <span>YOUR DRIP</span>

            <h1>MEUS FAVORITOS</h1>

            <p>
                Guarde suas peças favoritas e encontre tudo o que você curtiu
                em um só lugar.
            </p>

            <div class="contador-favoritos">

                <span>♡</span>

                <strong id="contador-favoritos">
                    0
                </strong>

                <span>itens salvos</span>

            </div>

        </header>

        <section id="lista-favoritos"></section>

    </main>

    <!-- Scripts -->

    <script src="../js/favoritos.js"></script>
    <script src="../js/script.js"></script>

</body>

</html>