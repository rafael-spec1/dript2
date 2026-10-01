<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $_SESSION = [];
    session_destroy();
    echo json_encode(['mensagem' => 'Sessao encerrada.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['mensagem' => 'Metodo nao permitido.']);
    exit;
}

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['mensagem' => 'Entre na sua conta para continuar.']);
    exit;
}

echo json_encode([
    'id' => (int) $_SESSION['usuario_id'],
    'nome' => $_SESSION['usuario_nome'],
    'email' => $_SESSION['usuario_email'],
]);