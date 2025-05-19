const pool = require("../config/db");

const createClient = async (clientData) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const userRes = await client.query(
            `INSERT INTO users (name, email, password, document, active) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [clientData.name, clientData.email, clientData.password, clientData.document, clientData.active]
        );
        const userId = userRes.rows[0].id;
        await client.query("COMMIT");
        return { id: userId };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getClientById = async (id) => {
    const result = await pool.query(
        `SELECT 
            u.*, 
            (SELECT json_agg(a.*) FROM addresses a WHERE a.user_id = u.id) AS addresses,
            (SELECT json_agg(c.phone_number) FROM contact_numbers c WHERE c.user_id = u.id) AS phone_numbers
         FROM users u
         WHERE u.id = $1`,
        [id]
    );
    return result.rowCount ? result.rows[0] : null;
};

const updateClient = async (id, name, email, password, active, phoneNumbers, addresses) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await client.query(
            `UPDATE users SET 
                name = COALESCE($1, name), 
                email = COALESCE($2, email), 
                password = COALESCE($3, password), 
                active = COALESCE($4, active)
             WHERE id = $5`,
            [name, email, password, active, id]
        );

        if (phoneNumbers?.length) {
            await client.query(`DELETE FROM contact_numbers WHERE user_id = $1`, [id]);
            const phonePromises = phoneNumbers.map(phone =>
                client.query(`INSERT INTO contact_numbers (user_id, phone_number) VALUES ($1, $2)`, [id, phone])
            );
            await Promise.all(phonePromises);
        }

        if (addresses?.length) {
            await client.query(`DELETE FROM addresses WHERE user_id = $1`, [id]);
            const addrPromises = addresses.map(addr =>
                client.query(
                    `INSERT INTO addresses (user_id, street, number, complement, neighborhood, city, state, country, zipcode, adr_type)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [id, addr.street, addr.number, addr.complement, addr.neighborhood, addr.city, addr.state, addr.country, addr.zipcode, addr.adr_type]
                )
            );
            await Promise.all(addrPromises);
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const deleteClient = async (id) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(`DELETE FROM addresses WHERE user_id = $1`, [id]);
        await client.query(`DELETE FROM contact_numbers WHERE user_id = $1`, [id]);
        const res = await client.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        await client.query("COMMIT");
        return res.rowCount ? res.rows[0] : null;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

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

module.exports = {
    createClient,
    getClientById,
    updateClient,
    deleteClient,
    searchClients
};
