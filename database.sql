CREATE DATABASE IF NOT EXISTS dript
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dript;

-- Usuarios: nunca salve a senha original. A API deve salvar apenas um hash.
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Migra bancos criados antes da coluna tipo existir sem falhar em reexecucoes.
SET @coluna_tipo_existe = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'usuarios'
      AND column_name = 'tipo'
);
SET @sql_tipo = IF(
    @coluna_tipo_existe = 0,
    'ALTER TABLE usuarios ADD COLUMN tipo ENUM(''cliente'', ''admin'') NOT NULL DEFAULT ''cliente''',
    'SELECT 1'
);
PREPARE adicionar_tipo FROM @sql_tipo;
EXECUTE adicionar_tipo;
DEALLOCATE PREPARE adicionar_tipo;

-- Impede que qualquer alteracao ultrapasse tres administradores.
DROP TRIGGER IF EXISTS limitar_admins_insert;
DROP TRIGGER IF EXISTS limitar_admins_update;

DELIMITER $$
CREATE TRIGGER limitar_admins_insert
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'admin' AND (SELECT COUNT(*) FROM usuarios WHERE tipo = 'admin') >= 3 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'O limite de tres administradores foi atingido.';
    END IF;
END$$

CREATE TRIGGER limitar_admins_update
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF OLD.tipo <> 'admin'
       AND NEW.tipo = 'admin'
       AND (SELECT COUNT(*) FROM usuarios WHERE tipo = 'admin') >= 3 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'O limite de tres administradores foi atingido.';
    END IF;
END$$
DELIMITER ;

-- Promove o usuario informado somente se ainda houver uma vaga.
UPDATE usuarios AS alvo
JOIN (
    SELECT COUNT(*) AS total_admins
    FROM usuarios
    WHERE tipo = 'admin'
) AS contagem ON contagem.total_admins < 3
SET alvo.tipo = 'admin'
WHERE LOWER(alvo.email) = 'gvilasboascarpi@gmail.com';

CREATE TABLE IF NOT EXISTS produtos (
    id INT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    preco_centavos INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagem VARCHAR(255),
    tag VARCHAR(50),
    descricao TEXT,
    avaliacao DECIMAL(2,1)
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    metodo_pagamento ENUM('cartao', 'pix', 'boleto') NOT NULL,
    total_centavos INT NOT NULL,
    nome_entrega VARCHAR(120),
    email_entrega VARCHAR(254),
    cep VARCHAR(8),
    endereco VARCHAR(180),
    numero VARCHAR(20),
    cidade VARCHAR(120),
    frete_centavos INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'recebido',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario_centavos INT NOT NULL,
    tamanho VARCHAR(20),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS favoritos (
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, produto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

INSERT IGNORE INTO produtos
    (id, nome, preco_centavos, categoria, imagem, tag, descricao, avaliacao)
VALUES
    (1, 'Camiseta DRIPT', 9990, 'camiseta', '../IMG/camiseta-fashion-free-black.png', 'LIMITED', 'Camiseta oversized premium DRIPT confeccionada em algodao de alta qualidade.', 4.9),
    (2, 'Moletom DRIPT', 17990, 'moletom', '../IMG/moletom-rio-arabe-black.png', 'LIMITED', 'Moletom premium DRIPT com tecido encorpado e modelagem streetwear.', 5.0),
    (3, 'Calca DRIPT', 19990, 'calca', '../IMG/calca-dript.png', 'NEW', 'Calca cargo DRIPT inspirada na cultura urbana.', 4.8),
    (4, 'Bone DRIPT', 8990, 'acessorio', '../IMG/camiseta-basica.png', 'NEW', 'Bone DRIPT ajustavel com acabamento premium.', 4.7),
    (5, 'Camiseta Oversized DRIPT', 11990, 'camiseta', '../IMG/camiseta-fashion-free.png', 'NEW', 'Camiseta oversized DRIPT com visual minimalista e modelagem streetwear.', 4.9),
    (6, 'Calca Jeans DRIPT', 22990, 'calca', '../IMG/calca-dript.png', 'NEW', 'Calca jeans DRIPT com modelagem moderna e inspiracao streetwear.', 4.8);
CREATE TABLE IF NOT EXISTS CONTATOS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Adiciona os dados de entrega tambem em bancos que ja possuem pedidos.
SET @coluna_frete_existe = (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'pedidos' AND column_name = 'frete_centavos'
);
SET @sql_frete = IF(
    @coluna_frete_existe = 0,
    'ALTER TABLE pedidos ADD COLUMN nome_entrega VARCHAR(120), ADD COLUMN email_entrega VARCHAR(254), ADD COLUMN cep VARCHAR(8), ADD COLUMN endereco VARCHAR(180), ADD COLUMN numero VARCHAR(20), ADD COLUMN cidade VARCHAR(120), ADD COLUMN frete_centavos INT NOT NULL DEFAULT 0',
    'SELECT 1'
);
PREPARE adicionar_dados_entrega FROM @sql_frete;
EXECUTE adicionar_dados_entrega;
DEALLOCATE PREPARE adicionar_dados_entrega;