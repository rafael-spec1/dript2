<?php
declare(strict_types=1);

session_start();

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] ?? '') !== 'admin') {
    header('Location: conta.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Administrativo | DRIPT</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/dashboard.css">
</head>
<body class="dashboard-body">
    <aside class="dashboard-sidebar">
        <a href="index.php" class="dashboard-logo">DRIPT<span>.</span></a>
        <nav>
            <a href="dashboard.php" class="ativo">Visão geral</a>
            <a href="pedidos.php">Pedidos</a>
            <a href="index.php">Loja</a>
        </nav>
        <a class="dashboard-voltar" href="conta.php">Minha conta</a>
    </aside>

    <main class="dashboard-main">
        <header class="dashboard-header">
            <div>
                <span class="dashboard-eyebrow">ADMINISTRACAO</span>
                <h1>Visão geral</h1>
            </div>
            <button type="button" onclick="window.location.reload()">Atualizar dados</button>
        </header>

        <section class="metric-grid">
            <article class="metric-card destaque">
                <span>Faturamento</span>
                <strong id="faturamento">R$ 0,00</strong>
                <small id="pedidos-hoje">0 pedidos hoje</small>
            </article>
            <article class="metric-card">
                <span>Pedidos</span>
                <strong id="total-pedidos">0</strong>
                <small id="itens-vendidos">0 itens vendidos</small>
            </article>
            <article class="metric-card">
                <span>Pessoas que fizeram login</span>
                <strong id="usuarios-logaram">0</strong>
                <small id="logins-hoje">0 logins hoje</small>
            </article>
            <article class="metric-card">
                <span>Clientes cadastrados</span>
                <strong id="total-clientes">0</strong>
                <small id="logins-total">0 acessos totais</small>
            </article>
        </section>

        <section class="dashboard-grid">
            <article class="dashboard-panel pedidos-panel">
                <div class="panel-header">
                    <div>
                        <span>VENDAS</span>
                        <h2>Últimos pedidos</h2>
                    </div>
                    <strong id="ticket-medio">Valor médio R$ 0,00</strong>
                </div>
                <div class="tabela-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Itens</th>
                                <th>Pagamento</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody id="lista-pedidos">
                            <tr><td colspan="6" class="estado-vazio">Carregando pedidos...</td></tr>
                        </tbody>
                    </table>
                </div>
            </article>

            <article class="dashboard-panel">
                <div class="panel-header">
                    <div>
                        <span>CATALOGO</span>
                        <h2>Status dos pedidos</h2>
                    </div>
                </div>
                <div id="status-pedidos" class="lista-resumo"></div>
            </article>

            <article class="dashboard-panel">
                <div class="panel-header">
                    <div>
                        <span>PAGAMENTOS</span>
                        <h2>Forma de pagamento</h2>
                    </div>
                </div>
                <div id="metodos-pagamento" class="lista-resumo"></div>
            </article>

            <article class="dashboard-panel mais-vendidos">
                <div class="panel-header">
                    <div>
                        <span>DESTAQUES</span>
                        <h2>Produtos mais vendidos</h2>
                    </div>
                    <strong id="total-produtos">0 produtos</strong>
                </div>
                <div id="lista-mais-vendidos" class="lista-produtos"></div>
            </article>
        </section>
    </main>

    <script>
        function moedaCentavos(valor) {
            return `R$ ${(Number(valor) / 100).toFixed(2).replace(".", ",")}`;
        }

        function escaparHtml(valor) {
            const elemento = document.createElement("div");
            elemento.textContent = String(valor ?? "");
            return elemento.innerHTML;
        }

        fetch("../php/dashboard.php")
            .then(async resposta => {
                const dados = await resposta.json();
                if (!resposta.ok) {
                    throw new Error(dados.mensagem || "Não foi possível carregar o painel.");
                }
                return dados;
            })
            .then(dados => {
                document.getElementById("faturamento").textContent = moedaCentavos(dados.faturamento_centavos);
                document.getElementById("total-pedidos").textContent = dados.pedidos;
                document.getElementById("total-clientes").textContent = dados.clientes;
                document.getElementById("usuarios-logaram").textContent = dados.usuarios_logaram;
                document.getElementById("logins-hoje").textContent = `${dados.logins_hoje} logins hoje`;
                document.getElementById("logins-total").textContent = `${dados.logins_total} acessos totais`;
                document.getElementById("pedidos-hoje").textContent = `${dados.pedidos_hoje} pedidos hoje`;
                document.getElementById("itens-vendidos").textContent = `${dados.itens_vendidos} itens vendidos`;
                document.getElementById("ticket-medio").textContent =
                    `Ticket médio ${moedaCentavos(dados.ticket_medio_centavos)}`;
                document.getElementById("total-produtos").textContent =
                    `${dados.produtos} produtos`;

                const pedidos = document.getElementById("lista-pedidos");
                pedidos.innerHTML = dados.ultimos_pedidos.length
                    ? dados.ultimos_pedidos.map(pedido => `
                        <tr>
                            <td><strong>#${pedido.id}</strong></td>
                            <td>${escaparHtml(pedido.usuario_nome)}</td>
                            <td>${pedido.quantidade_itens}</td>
                            <td>${pedido.metodo_pagamento}</td>
                            <td><span class="status status-${escaparHtml(pedido.status)}">${escaparHtml(pedido.status)}</span></td>
                            <td><strong>${moedaCentavos(pedido.total_centavos)}</strong></td>
                        </tr>
                    `).join("")
                    : '<tr><td colspan="6" class="estado-vazio">Nenhum pedido registrado.</td></tr>';

                document.getElementById("status-pedidos").innerHTML =
                    dados.status_pedidos.length
                        ? dados.status_pedidos.map(item => `
                            <div class="linha-resumo">
                                <span>${escaparHtml(item.status)}</span>
                                <strong>${item.total}</strong>
                            </div>
                        `).join("")
                        : '<p class="estado-vazio">Sem dados.</p>';

                document.getElementById("metodos-pagamento").innerHTML =
                    dados.metodos_pagamento.length
                        ? dados.metodos_pagamento.map(item => `
                            <div class="linha-resumo">
                                <span>${escaparHtml(item.metodo_pagamento)}</span>
                                <strong>${item.total}</strong>
                            </div>
                        `).join("")
                        : '<p class="estado-vazio">Sem dados.</p>';

                document.getElementById("lista-mais-vendidos").innerHTML =
                    dados.mais_vendidos.length
                        ? dados.mais_vendidos.map((produto, indice) => `
                            <div class="produto-ranking">
                                <span class="posicao">${indice + 1}</span>
                                <img src="${escaparHtml(produto.imagem)}" alt="${escaparHtml(produto.nome)}">
                                <div>
                                    <strong>${escaparHtml(produto.nome)}</strong>
                                    <small>${produto.quantidade} vendidos</small>
                                </div>
                                <b>${moedaCentavos(produto.faturamento_centavos)}</b>
                            </div>
                        `).join("")
                        : '<p class="estado-vazio">Nenhuma venda registrada.</p>';
            })
            .catch(erro => alert(erro.message));
    </script>
</body>
</html>
