<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['mensagem' => 'Metodo nao permitido.']);
    exit;
}

require __DIR__ . '/conexao.php';

$dados = json_decode(file_get_contents('php://input'), true) ?? [];
$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $senha === '') {
    http_response_code(422);
    echo json_encode(['mensagem' => 'Informe um e-mail e uma senha validos.']);
    exit;
}

 $comando = $pdo->prepare('SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = :email LIMIT 1');
$comando->execute([':email' => $email]);
$usuario = $comando->fetch();

if (!$usuario || !password_verify($senha, $usuario['senha_hash'])) {
    http_response_code(401);
    echo json_encode(['mensagem' => 'E-mail ou senha incorretos.']);
    exit;
}

session_regenerate_id(true);
$_SESSION['usuario_id'] = (int) $usuario['id'];
$_SESSION['usuario_nome'] = $usuario['nome'];
$_SESSION['usuario_email'] = $usuario['email'];
$_SESSION['usuario_tipo'] = $usuario['tipo'];

echo json_encode(['mensagem' => 'Login realizado.', 'usuario' => ['nome' => $usuario['nome'], 'email' => $usuario['email']]]);