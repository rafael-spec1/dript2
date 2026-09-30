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

$pedidos = (int) $pdo->query('SELECT COUNT(*) FROM pedidos')->fetchColumn();
$produtos = (int) $pdo->query('SELECT COUNT(*) FROM produtos')->fetchColumn();
$faturamentoCentavos = (int) $pdo->query(
    "SELECT COALESCE(SUM(total_centavos), 0) FROM pedidos WHERE status <> 'cancelado'"
)->fetchColumn();

$ultimosPedidos = $pdo->query(
    'SELECT p.id, p.total_centavos, p.status, p.criado_em, u.nome AS usuario_nome
     FROM pedidos p
     INNER JOIN usuarios u ON u.id = p.usuario_id
     ORDER BY p.criado_em DESC
     LIMIT 8'
)->fetchAll();

foreach ($ultimosPedidos as &$pedido) {
    $pedido['id'] = (int) $pedido['id'];
    $pedido['total_centavos'] = (int) $pedido['total_centavos'];
}
unset($pedido);

echo json_encode([
    'pedidos' => $pedidos,
    'produtos' => $produtos,
    'faturamento_centavos' => $faturamentoCentavos,
    'ultimos_pedidos' => $ultimosPedidos,
], JSON_UNESCAPED_UNICODE);
