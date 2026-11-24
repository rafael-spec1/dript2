
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Meus Favoritos | DRIPT</title>

    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/icones.css">
    <link rel="stylesheet" href="../css/favoritos.css">
</head>

<body class="pagina-favoritos">

    <!-- NAVBAR -->
    <nav class="navbar">

        <a href="index.php" class="logo">DRIPT</a>

        <ul class="menu">
            <li>
                <a href="index.php">INÍCIO</a>
            </li>
        </ul>

    </nav>

    <!-- CONTEÚDO DOS FAVORITOS -->
    <main class="favoritos-container">

        <header class="favoritos-topo">

            <span>DRIPT COLLECTION</span>

            <h1>MEUS FAVORITOS</h1>

            <p>
                Suas peças favoritas reunidas em um só lugar.
                Encontre seu próximo estilo e leve com você.
            </p>

            <div class="contador-favoritos">
                PEÇAS SALVAS:
                <strong id="contador-favoritos">0</strong>
            </div>

        </header>

        <section id="lista-favoritos">

        </section>

    </main>

    <!-- SCRIPTS -->
    <script src="../js/favoritos.js"></script>
    <script src="../js/script.js"></script>

</body>

</html>
