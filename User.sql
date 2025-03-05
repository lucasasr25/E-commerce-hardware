CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    gender VARCHAR(255),
    birth VARCHAR (255),
    document VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL, -- Armazena hash da senha
    active BOOLEAN DEFAULT TRUE, -- Usuário ativo por padrão
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualização automática de updated_at
CREATE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Criando tabela para endereços
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('entrega', 'cobranca', 'outro')),
    street TEXT NOT NULL,
    number VARCHAR(10),
    complement TEXT,
    neighborhood TEXT,
    city TEXT NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criando Para Telefone
CREATE TABLE phones (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(15) NOT NULL, -- Adapte o tamanho conforme necessário
    type VARCHAR(20) CHECK (type IN ('celular', 'fixo', 'outro')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
