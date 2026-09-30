<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['mensagem' => 'Metodo nao permitido.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true) ?? [];
$nome = trim($dados['nome'] ?? '');
$email = strtolower(trim($dados['email'] ?? ''));
$mensagem = trim($dados['mensagem'] ?? '');

if ($nome === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $mensagem === '') {
    http_response_code(422);
    echo json_encode(['mensagem' => 'Preencha nome, e-mail valido e mensagem.']);
    exit;
}

require __DIR__ . '/conexao.php';
$comando = $pdo->prepare('INSERT INTO contatos (nome, email, mensagem) VALUES (:nome, :email, :mensagem)');
$comando->execute([':nome' => $nome, ':email' => $email, ':mensagem' => $mensagem]);

echo json_encode(['mensagem' => 'Mensagem recebida.']);