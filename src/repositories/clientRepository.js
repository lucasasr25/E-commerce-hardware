const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const registerClient = async (name, email, passwordHash, document, addresses) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const clientResult = await client.query(
            `INSERT INTO users (name, email, password, document) 
             VALUES ($1, $2, $3, $4) RETURNING id, document`,
            [name, email, passwordHash, document]  // Gerando o documento (UUID)
        );

        const clientId = clientResult.rows[0].id;

        if (addresses && addresses.length > 0) {
            const addressPromises = addresses.map((address) => {
                return client.query(
                    `INSERT INTO addresses (user_id, street, number, complement, neighborhood, city, state, country, zipcode)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [clientId, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, address.country, address.zipcode]
                );
            });
            await Promise.all(addressPromises);
        }

        await client.query("COMMIT");
        return clientResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const updateClient = async (id, name, email, password, active) => {
    const result = await pool.query(
        `UPDATE users 
         SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password)
         WHERE id = $4 RETURNING *`,
        [name, email, password, id]
    );

    return result.rowCount ? result.rows[0] : null;
};

const searchClients = async ({ name, email, document }) => {
    let query = `SELECT * FROM users WHERE 1=1`;
    let values = [];
    let count = 1;

    if (name) {
        query += ` AND name ILIKE $${count++}`;
        values.push(`%${name}%`);
    }
    if (email) {
        query += ` AND email = $${count++}`;
        values.push(email);
    }
    if (document) {
        query += ` AND document = $${count++}`;
        values.push(document);
    }

    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = { registerClient, updateClient, searchClients };
