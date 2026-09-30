<?php
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['mensagem' => 'Entre na sua conta para salvar favoritos.']);
    exit;
}

require __DIR__ . '/conexao.php';
$usuarioId = (int) $_SESSION['usuario_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $comando = $pdo->prepare(
        'SELECT p.id AS produto_id, p.nome, p.preco_centavos, p.imagem
         FROM favoritos f
         INNER JOIN produtos p ON p.id = f.produto_id
         WHERE f.usuario_id = :usuario_id
         ORDER BY f.criado_em DESC'
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
$produtoId = filter_var($dados['produto_id'] ?? null, FILTER_VALIDATE_INT);
if (!$produtoId) {
    http_response_code(422);
    echo json_encode(['mensagem' => 'Produto invalido.']);
    exit;
}

$buscar = $pdo->prepare('SELECT 1 FROM favoritos WHERE usuario_id = :usuario_id AND produto_id = :produto_id');
$buscar->execute([':usuario_id' => $usuarioId, ':produto_id' => $produtoId]);
$favoritado = !$buscar->fetchColumn();

if ($favoritado) {
    $comando = $pdo->prepare('INSERT INTO favoritos (usuario_id, produto_id) VALUES (:usuario_id, :produto_id)');
} else {
    $comando = $pdo->prepare('DELETE FROM favoritos WHERE usuario_id = :usuario_id AND produto_id = :produto_id');
}
$comando->execute([':usuario_id' => $usuarioId, ':produto_id' => $produtoId]);

$contagem = $pdo->prepare('SELECT COUNT(*) FROM favoritos WHERE usuario_id = :usuario_id');
$contagem->execute([':usuario_id' => $usuarioId]);
echo json_encode(['favoritado' => $favoritado, 'total' => (int) $contagem->fetchColumn()]);