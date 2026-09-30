<?php
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['mensagem' => 'Faca login para continuar.']);
    exit;
}

require __DIR__ . '/conexao.php';
$usuarioId = (int) $_SESSION['usuario_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $comando = $pdo->prepare(
        'SELECT p.id, p.metodo_pagamento, p.total_centavos, p.frete_centavos, p.status, p.criado_em,
            p.nome_entrega, p.email_entrega, p.cep, p.endereco, p.numero, p.cidade,
                COALESCE(SUM(i.quantidade), 0) AS quantidade_itens
         FROM pedidos p
         LEFT JOIN itens_pedido i ON i.pedido_id = p.id
         WHERE p.usuario_id = :usuario_id
         GROUP BY p.id
         ORDER BY p.criado_em DESC'
    );
    $comando->execute([':usuario_id' => $usuarioId]);
    echo json_encode($comando->fetchAll(), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['mensagem' => 'Metodo nao permitido.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true) ?? [];
if (!is_array($dados)) {
    $dados = [];
}
$metodosValidos = ['cartao', 'pix', 'boleto'];
$metodo = $dados['metodo'] ?? '';
$itens = $dados['itens'] ?? [];
$entrega = $dados['entrega'] ?? [];
if (!is_array($entrega)) {
    $entrega = [];
}
$nomeEntrega = trim($entrega['nome'] ?? '');
$emailEntrega = trim($entrega['email'] ?? '');
$cep = preg_replace('/\D/', '', $entrega['cep'] ?? '');
$endereco = trim($entrega['endereco'] ?? '');
$numero = trim($entrega['numero'] ?? '');
$cidade = trim($entrega['cidade'] ?? '');
$freteCentavos = 2000;

if (!in_array($metodo, $metodosValidos, true) || !is_array($itens) || count($itens) === 0
    || $nomeEntrega === '' || !filter_var($emailEntrega, FILTER_VALIDATE_EMAIL)
    || strlen($cep) !== 8 || $endereco === '' || $numero === '' || $cidade === '') {
    http_response_code(422);
    echo json_encode(['mensagem' => 'Pedido ou metodo de pagamento invalido.']);
    exit;
}

try {
    $pdo->beginTransaction();
    $totalCentavos = $freteCentavos;
    $itensValidados = [];
    $buscarProduto = $pdo->prepare(
        'SELECT id, preco_centavos FROM produtos WHERE id = :id LIMIT 1'
    );

    foreach ($itens as $item) {
        if (!is_array($item)) {
            throw new InvalidArgumentException('Item invalido.');
        }

        $produtoId = filter_var($item['produto_id'] ?? null, FILTER_VALIDATE_INT);
        $quantidade = filter_var($item['quantidade'] ?? null, FILTER_VALIDATE_INT);

        if (!$produtoId || !$quantidade || $quantidade < 1 || $quantidade > 99) {
            throw new InvalidArgumentException('Item invalido.');
        }

        $buscarProduto->execute([':id' => $produtoId]);
        $produto = $buscarProduto->fetch();

        if (!$produto) {
            throw new InvalidArgumentException('Produto nao encontrado.');
        }

        $preco = (int) $produto['preco_centavos'];
        $totalCentavos += $preco * $quantidade;
        $itensValidados[] = [
            'produto_id' => $produtoId,
            'quantidade' => $quantidade,
            'preco' => $preco,
            'tamanho' => isset($item['tamanho']) ? substr((string) $item['tamanho'], 0, 20) : null,
        ];
    }

    $criarPedido = $pdo->prepare(
        'INSERT INTO pedidos
            (usuario_id, metodo_pagamento, total_centavos, nome_entrega, email_entrega, cep, endereco, numero, cidade, frete_centavos)
         VALUES (:usuario_id, :metodo, :total, :nome, :email, :cep, :endereco, :numero, :cidade, :frete)'
    );
    $criarPedido->execute([
        ':usuario_id' => $usuarioId,
        ':metodo' => $metodo,
        ':total' => $totalCentavos,
        ':nome' => $nomeEntrega,
        ':email' => $emailEntrega,
        ':cep' => $cep,
        ':endereco' => $endereco,
        ':numero' => $numero,
        ':cidade' => $cidade,
        ':frete' => $freteCentavos,
    ]);
    $pedidoId = (int) $pdo->lastInsertId();

    $criarItem = $pdo->prepare(
        'INSERT INTO itens_pedido
            (pedido_id, produto_id, quantidade, preco_unitario_centavos, tamanho)
         VALUES (:pedido_id, :produto_id, :quantidade, :preco, :tamanho)'
    );

    foreach ($itensValidados as $item) {
        $criarItem->execute([
            ':pedido_id' => $pedidoId,
            ':produto_id' => $item['produto_id'],
            ':quantidade' => $item['quantidade'],
            ':preco' => $item['preco'],
            ':tamanho' => $item['tamanho'],
        ]);
    }

    $pdo->commit();
    echo json_encode(['mensagem' => 'Pedido salvo.', 'pedido_id' => $pedidoId]);
} catch (Throwable $erro) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code($erro instanceof InvalidArgumentException ? 422 : 500);
    echo json_encode(['mensagem' => $erro->getMessage()]);
}
