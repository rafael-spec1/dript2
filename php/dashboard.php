<?php
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_tipo'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['mensagem' => 'Acesso restrito a administradores.']);
    exit;
}

require __DIR__ . '/conexao.php';

$pdo->exec(
    'CREATE TABLE IF NOT EXISTS logins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        usuario_id INT NOT NULL,
        criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )'
);

$clientes = (int) $pdo->query(
    "SELECT COUNT(*) FROM usuarios WHERE tipo = 'cliente'"
)->fetchColumn();
$loginsTotal = (int) $pdo->query('SELECT COUNT(*) FROM logins')->fetchColumn();
$usuariosLogaram = (int) $pdo->query(
    'SELECT COUNT(DISTINCT usuario_id) FROM logins'
)->fetchColumn();
$loginsHoje = (int) $pdo->query(
    "SELECT COUNT(*) FROM logins WHERE DATE(criado_em) = CURDATE()"
)->fetchColumn();
$pedidos = (int) $pdo->query('SELECT COUNT(*) FROM pedidos')->fetchColumn();
$pedidosHoje = (int) $pdo->query(
    "SELECT COUNT(*) FROM pedidos WHERE DATE(criado_em) = CURDATE()"
)->fetchColumn();
$produtos = (int) $pdo->query('SELECT COUNT(*) FROM produtos')->fetchColumn();
$faturamentoCentavos = (int) $pdo->query(
    "SELECT COALESCE(SUM(total_centavos), 0) FROM pedidos WHERE status <> 'cancelado'"
)->fetchColumn();
$ticketMedioCentavos = $pedidos > 0
    ? (int) round($faturamentoCentavos / $pedidos)
    : 0;
$itensVendidos = (int) $pdo->query(
    "SELECT COALESCE(SUM(i.quantidade), 0)
     FROM itens_pedido i
     INNER JOIN pedidos p ON p.id = i.pedido_id
     WHERE p.status <> 'cancelado'"
)->fetchColumn();

$ultimosPedidos = $pdo->query(
    'SELECT p.id, p.metodo_pagamento, p.total_centavos, p.status, p.criado_em,
            u.nome AS usuario_nome,
            COALESCE(SUM(i.quantidade), 0) AS quantidade_itens
     FROM pedidos p
     INNER JOIN usuarios u ON u.id = p.usuario_id
     LEFT JOIN itens_pedido i ON i.pedido_id = p.id
     GROUP BY p.id
     ORDER BY p.criado_em DESC
     LIMIT 8'
)->fetchAll();

foreach ($ultimosPedidos as &$pedido) {
    $pedido['id'] = (int) $pedido['id'];
    $pedido['total_centavos'] = (int) $pedido['total_centavos'];
    $pedido['quantidade_itens'] = (int) $pedido['quantidade_itens'];
}
unset($pedido);

$statusPedidos = $pdo->query(
    'SELECT status, COUNT(*) AS total
     FROM pedidos
     GROUP BY status'
)->fetchAll();

$metodosPagamento = $pdo->query(
    'SELECT metodo_pagamento, COUNT(*) AS total
     FROM pedidos
     GROUP BY metodo_pagamento'
)->fetchAll();

$maisVendidos = $pdo->query(
    'SELECT pr.id, pr.nome, pr.imagem,
            SUM(i.quantidade) AS quantidade,
            SUM(i.quantidade * i.preco_unitario_centavos) AS faturamento_centavos
     FROM itens_pedido i
     INNER JOIN produtos pr ON pr.id = i.produto_id
     INNER JOIN pedidos p ON p.id = i.pedido_id
     WHERE p.status <> "cancelado"
     GROUP BY pr.id
     ORDER BY quantidade DESC
     LIMIT 5'
)->fetchAll();

foreach ($maisVendidos as &$produto) {
    $produto['quantidade'] = (int) $produto['quantidade'];
    $produto['faturamento_centavos'] = (int) $produto['faturamento_centavos'];
}
unset($produto);

echo json_encode([
    'clientes' => $clientes,
    'logins_total' => $loginsTotal,
    'usuarios_logaram' => $usuariosLogaram,
    'logins_hoje' => $loginsHoje,
    'pedidos' => $pedidos,
    'pedidos_hoje' => $pedidosHoje,
    'produtos' => $produtos,
    'faturamento_centavos' => $faturamentoCentavos,
    'ticket_medio_centavos' => $ticketMedioCentavos,
    'itens_vendidos' => $itensVendidos,
    'ultimos_pedidos' => $ultimosPedidos,
    'status_pedidos' => $statusPedidos,
    'metodos_pagamento' => $metodosPagamento,
    'mais_vendidos' => $maisVendidos,
], JSON_UNESCAPED_UNICODE);
