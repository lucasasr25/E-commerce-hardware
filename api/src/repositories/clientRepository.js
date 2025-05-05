const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");




const createCreditCard = async (userId, cardNumber, holderName, expirationDate, is_default_) => {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, is_default)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(query, [userId, cardNumber, holderName, expirationDate, is_default_]);
    } catch (error) {
        console.error("Erro ao adicionar cartão de crédito:", error);
        throw error;
    }
};


const updateCreditCard = async (userId, cardNumber, holderName, expirationDate, is_default_) => {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, is_default)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (card_number) 
            DO UPDATE 
            SET 
                user_id = EXCLUDED.user_id,
                holder_name = EXCLUDED.holder_name,
                expiration_date = EXCLUDED.expiration_date,
                is_default = EXCLUDED.is_default;
        `;
        await client.query(query, [userId, cardNumber, holderName, expirationDate, is_default_]);
    } catch (error) {
        console.error("Erro ao adicionar ou atualizar cartão de crédito:", error);
        throw error;
    } finally {
        client.release();
    }
};


const getCreditCardsByUserId = async (userId) => {
    const client = await pool.connect();

    const result = await client.query(
        'SELECT id, card_number, holder_name, expiration_date FROM credit_cards WHERE user_id = $1',
        [userId]
    );
    return result.rows;
};

const deleteCreditCard = async (cardId) => {
    const client = await pool.connect();
    try {
        const query = `
            DELETE FROM credit_cards
            WHERE id = $1
        `;
        const result = await client.query(query, [cardId]);

        if (result.rowCount === 0) {
            throw new Error('Cartão não encontrado');
        }
        console.log(`Cartão com ID ${cardId} excluído com sucesso.`);
    } catch (error) {
        console.error("Erro ao excluir cartão de crédito:", error);
        throw error;
    } finally {
        client.release();
    }
};

const createClient = async (name, email, password, document, active, phoneNumbers, addresses) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        // Criação do cliente (agora inclui o documento)
        const clientResult = await client.query(
            `INSERT INTO users (name, email, password, document, active) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, document`,
            [name, email, password, document, active]
        );

        const clientId = clientResult.rows[0].id;

        // Verifica se existem endereços e os insere
        if (addresses && addresses.length > 0) {
            const addressPromises = addresses.map((address) => {
                return client.query(
                    `INSERT INTO addresses (user_id, street, number, complement, neighborhood, city, state, country, zipcode, adr_type)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [clientId, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, address.country, address.zipcode, address.adr_type]
                );
            });
            // Executa todas as inserções de endereços de forma paralela
            await Promise.all(addressPromises);
        }

        // Adiciona os números de telefone ao cliente
        if (phoneNumbers && phoneNumbers.length > 0) {
            const phonePromises = phoneNumbers.map((phoneNumber) => {
                return client.query(
                    `INSERT INTO contact_numbers (user_id, phone_number) 
                     VALUES ($1, $2)`,
                    [clientId, phoneNumber]
                );
            });
            // Executa todas as inserções de telefones de forma paralela
            await Promise.all(phonePromises);
        }

        await client.query("COMMIT");
        return clientResult.rows[0]; // Retorna o cliente criado

    } catch (error) {
        await client.query("ROLLBACK");
        throw error; // Lança o erro para ser tratado pelo controlador
    } finally {
        client.release(); // Libera o cliente da conexão
    }
};


// Função para obter um cliente pelo ID, incluindo os telefones
const getClientById = async (id) => {
    const result = await pool.query(
        `SELECT 
    u.*, 
    (
        SELECT json_agg(a.*) 
        FROM addresses a 
        WHERE a.user_id = u.id
    ) AS addresses,
    (
        SELECT json_agg(c.phone_number) 
        FROM contact_numbers c 
        WHERE c.user_id = u.id
    ) AS phone_numbers
FROM users u
WHERE u.id = $1`,
        [id]
    );
    return result.rowCount ? result.rows[0] : null;
};

const deleteClient = async (id) => {
    const client = await pool.connect(); // Conecta ao pool do banco de dados
    try {
        await client.query("BEGIN"); // Inicia uma transação

        // Deleta os endereços associados ao cliente
        await client.query(`DELETE FROM addresses WHERE user_id = $1`, [id]);

        // Deleta os números de telefone associados ao cliente
        await client.query(`DELETE FROM contact_numbers WHERE user_id = $1`, [id]);

        // Deleta o cliente
        const result = await client.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);

        if (result.rowCount === 0) {
            return null; // Se o cliente não foi encontrado, retorna null
        }

        await client.query("COMMIT"); // Confirma a transação
        return result.rows[0]; // Retorna o cliente deletado
    } catch (error) {
        await client.query("ROLLBACK"); // Se ocorrer erro, desfaz a transação
        console.error("Erro ao deletar cliente:", error);
        throw new Error("Erro ao deletar cliente"); // Lança o erro
    } finally {
        client.release(); // Libera o cliente da conexão
    }
};

const updateClient = async (id, name, email, password, active, phoneNumbers, addresses) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Atualiza os dados do cliente
        const result = await client.query(
            `UPDATE users 
             SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), active = COALESCE($4, active)
             WHERE id = $5 RETURNING *`,
            [name, email, password, active, id]
        );
        console.log("1")
        // Se existirem novos números de telefone, os adiciona
        if (phoneNumbers && phoneNumbers.length > 0) {
            // Remove os telefones antigos antes de adicionar os novos
            await client.query(`DELETE FROM contact_numbers WHERE user_id = $1`, [id]);

            const phonePromises = phoneNumbers.map((phoneNumber) => {
                return client.query(
                    `INSERT INTO contact_numbers (user_id, phone_number) 
                     VALUES ($1, $2)`,
                    [id, phoneNumber]
                );
            });
            await Promise.all(phonePromises);
        }
        // Se existirem novos endereços, os adiciona
        if (addresses && addresses.length > 0) {
            await client.query(`DELETE FROM addresses WHERE user_id = $1   AND id NOT IN (
    SELECT address_id FROM orders WHERE address_id IS NOT NULL
);`, [id]);
            const addressPromises = addresses.map((address) => {
                return client.query(
                    `INSERT INTO addresses (user_id, adr_type, is_default, nick, street, number, complement, neighborhood, city, state, country, zipcode) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                    [id, address.adr_type, address.is_default, address.nick, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, address.country, address.zipcode]
                );
            });
            
        
            await Promise.all(addressPromises);
        }
        console.log("3")
        await client.query("COMMIT");
        return result.rowCount ? result.rows[0] : null;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error; // Lança o erro para ser tratado pelo controlador
    } finally {
        client.release(); // Libera o cliente da conexão
    }
};


const createPhone = async (clientId, phoneNumber) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO contact_numbers (user_id, phone_number) 
             VALUES ($1, $2) RETURNING id, phone_number`,
            [clientId, phoneNumber]
        );
        return result.rows[0]; // Retorna o telefone criado
    } catch (error) {
        throw error; // Lança o erro para ser tratado no controlador
    } finally {
        client.release(); // Libera o cliente da conexão
    }
};

// Função para buscar clientes com filtros, incluindo números de telefone
const searchClients = async ({ id, name, email, document }) => {
    let query = `
    SELECT u.*,
        (
            SELECT json_agg(a) 
            FROM addresses a 
            WHERE a.user_id = u.id
        ) AS addresses,
        (
            SELECT json_agg(c.phone_number) 
            FROM contact_numbers c 
            WHERE c.user_id = u.id
        ) AS phone_numbers
    FROM users u
    WHERE 1=1
`;

    let values = [];
    let count = 1;

    if (id) {
        query += ` AND u.id = $${count++}`;
        values.push(id);
    }
    if (name) {
        query += ` AND u.name ILIKE $${count++}`;
        values.push(`%${name}%`);
    }
    if (email) {
        query += ` AND u.email = $${count++}`;
        values.push(email);
    }
    if (document) {
        query += ` AND u.document = $${count++}`;
        values.push(document);
    }

    query += " GROUP BY u.id";

    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = { updateClient, updateCreditCard, deleteCreditCard, searchClients, getClientById, createClient, createPhone, deleteClient, createCreditCard, getCreditCardsByUserId };
