-- Criando tabela de clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    client_code UUID DEFAULT gen_random_uuid() UNIQUE, -- Garantindo unicidade
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Armazena hash da senha
    active BOOLEAN DEFAULT TRUE, -- Cliente ativo por padrão
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
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Criando tabela para endereços
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
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
