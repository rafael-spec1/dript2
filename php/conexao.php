<?php
declare(strict_types=1);

$servidor = 'localhost';
$banco = 'dript';
$usuario = 'root';
$senha = '';

$opcoes = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO(
        "mysql:host={$servidor};dbname={$banco};charset=utf8mb4",
        $usuario,
        $senha,
        $opcoes
    );
} catch (PDOException $erro) {
    http_response_code(500);
    exit('Nao foi possivel conectar ao banco de dados.');
}