const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const registerClient = async (name, email, passwordHash, addresses) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const clientResult = await client.query(
            `INSERT INTO clients (client_code, name, email, password_hash) 
             VALUES ($1, $2, $3, $4) RETURNING id, client_code`,
            [uuidv4(), name, email, passwordHash]
        );

        const clientId = clientResult.rows[0].id;

        if (addresses && addresses.length > 0) {
            const addressPromises = addresses.map((address) => {
                return client.query(
                    `INSERT INTO addresses (client_id, type, street, number, complement, neighborhood, city, state, zip_code)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [clientId, address.type, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, address.zip_code]
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

const updateClient = async (id, name, email, active) => {
    const result = await pool.query(
        `UPDATE clients 
         SET name = COALESCE($1, name), email = COALESCE($2, email), active = COALESCE($3, active)
         WHERE id = $4 RETURNING *`,
        [name, email, active, id]
    );

    return result.rowCount ? result.rows[0] : null;
};

const searchClients = async ({ name, email, client_code }) => {
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
    if (client_code) {
        query += ` AND id = $${count++}`;
        values.push(client_code);
    }

    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = { registerClient, updateClient, searchClients };
