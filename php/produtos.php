<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/conexao.php';

$comando = $pdo->query(
    'SELECT id, nome, preco_centavos, categoria, imagem, tag, descricao, avaliacao
     FROM produtos ORDER BY id'
);

$produtos = array_map(static function (array $produto): array {
    $produto['preco'] = ((int) $produto['preco_centavos']) / 100;
    unset($produto['preco_centavos']);
    return $produto;
}, $comando->fetchAll());

echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
