<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['mensagem' => 'Metodo nao permitido.']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
session_start();
require __DIR__ . '/conexao.php';

$dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$senha = $dados['senha'] ?? '';
$confirmarSenha = $dados['confirmarSenha'] ?? '';
$termos = !empty($dados['aceitarTermos']);

if ($nome === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($senha) < 6 || !$termos) {
    http_response_code(422);
    echo json_encode(['mensagem' => 'Preencha nome, e-mail valido e uma senha com pelo menos 6 caracteres.']);
    exit;
}

if ($senha !== $confirmarSenha) {
    http_response_code(422);
    echo json_encode(['mensagem' => 'As senhas nao coincidem.']);
    exit;
}

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

try {
    $comando = $pdo->prepare(
        'INSERT INTO usuarios (nome, email, senha_hash) VALUES (:nome, :email, :senha_hash)'
    );

    $comando->execute([
        ':nome' => $nome,
        ':email' => strtolower($email),
        ':senha_hash' => $senhaHash,
    ]);
    $usuarioId = (int) $pdo->lastInsertId();

    if (strtolower($email) === 'gvilasboascarpi@gmail.com') {
        $promover = $pdo->prepare(
            "UPDATE usuarios AS alvo
             JOIN (
                 SELECT COUNT(*) AS total_admins
                 FROM usuarios
                 WHERE tipo = 'admin'
             ) AS contagem ON contagem.total_admins < 3
             SET alvo.tipo = 'admin'
             WHERE alvo.email = :email"
        );
        $promover->execute([':email' => strtolower($email)]);
    }

    $buscarTipo = $pdo->prepare('SELECT tipo FROM usuarios WHERE id = :id');
    $buscarTipo->execute([':id' => $usuarioId]);

    session_regenerate_id(true);
    $_SESSION['usuario_id'] = $usuarioId;
    $_SESSION['usuario_nome'] = $nome;
    $_SESSION['usuario_email'] = strtolower($email);
    $_SESSION['usuario_tipo'] = $buscarTipo->fetchColumn() ?: 'cliente';
    echo json_encode(['mensagem' => 'Cadastro realizado.', 'usuario' => ['nome' => $nome, 'email' => strtolower($email)]]);
} catch (PDOException $erro) {
    if (($erro->errorInfo[1] ?? null) === 1062) {
        http_response_code(409);
        echo json_encode(['mensagem' => 'Este e-mail ja esta cadastrado.']);
        exit;
    }

    http_response_code(500);
    echo json_encode(['mensagem' => 'Nao foi possivel salvar o cadastro.']);
}