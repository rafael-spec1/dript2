<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meus Pedidos | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/conta.css">
    <link rel="stylesheet" href="../css/pedidos.css">
</head>

<body class="pagina-cadastro">

    <main class="cadastro">

        <a href="index.php" class="cadastro-logo">
            DRIPT<span>.</span>
        </a>

        <div class="conta-box">

            <div class="cadastro-topo">
                <span>MY DRIPT</span>

                <h1>Meus pedidos</h1>

                <p>
                    Acompanhe seus pedidos realizados na DRIPT.
                </p>
            </div>

            <div id="lista-pedidos">
                <p class="carregando-pedidos">Carregando seus pedidos...</p>
            </div>

            <a href="conta.php" class="btn-sobre">
                VOLTAR PARA MINHA CONTA
            </a>

        </div>

    </main>

    <script>
        const lista = document.getElementById("lista-pedidos");

        // Protege os textos exibidos na página
        const escapar = valor => String(valor ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]);

        // Busca os pedidos registrados
        fetch("../php/pedidos.php")
            .then(async resposta => {
                const dados = await resposta.json();

                if (resposta.status === 401) {
                    window.location.href = "login.php";
                    return null;
                }

                if (!resposta.ok) {
                    throw new Error(
                        dados.mensagem || "Não foi possível carregar os pedidos."
                    );
                }

                return dados;
            })
            .then(pedidos => {
                if (pedidos === null) return;

                if (!Array.isArray(pedidos) || pedidos.length === 0) {
                    lista.innerHTML = `
                        <div class="sem-pedidos">
                            <span class="icone-sem-pedidos">📦</span>
                            <h2>VOCÊ AINDA NÃO TEM PEDIDOS</h2>
                            <p>
                                Quando realizar uma compra, você poderá
                                acompanhar os detalhes por aqui.
                            </p>
                            <a href="index.php" class="btn-explorar-pedidos">
                                EXPLORAR PRODUTOS
                            </a>
                        </div>
                    `;
                    return;
                }

                lista.innerHTML = pedidos.map(pedido => `
                    <article class="pedido">
                        <div class="pedido-detalhes">
                            <span class="pedido-numero">
                                PEDIDO #${escapar(pedido.id)}
                            </span>

                            <h3>${escapar(pedido.status)}</h3>

                            <p>
                                Data:
                                ${escapar(
                                    pedido.criado_em
                                        ? new Date(pedido.criado_em).toLocaleDateString("pt-BR")
                                        : "Não informada"
                                )}
                            </p>

                            <p>
                                Pagamento: ${escapar(pedido.metodo_pagamento)}
                            </p>

                            <p>
                                Entrega:
                                ${escapar(pedido.endereco)},
                                ${escapar(pedido.numero)} -
                                ${escapar(pedido.cidade)}
                            </p>
                        </div>

                        <strong class="pedido-total">
                            R$ ${
                                (Number(pedido.total_centavos || 0) / 100)
                                    .toFixed(2)
                                    .replace(".", ",")
                            }
                        </strong>
                    </article>
                `).join("");
            })
            .catch(erro => {
                lista.innerHTML = `
                    <p class="erro-pedidos">
                        ${escapar(erro.message)}
                    </p>
                `;
            });
    </script>

</body>
</html>