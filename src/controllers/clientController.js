const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");

// Password validation
const validatePassword = [
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[\W]/).withMessage("Password must contain at least one special character"),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    })
];

const registerClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, addresses } = req.body;
    
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Start transaction
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const clientResult = await client.query(
                `INSERT INTO clients (client_code, name, email, password_hash) 
                 VALUES ($1, $2, $3, $4) RETURNING id, client_code`,
                [uuidv4(), name, email, passwordHash]
            );

            const clientId = clientResult.rows[0].id;

            // Register addresses if provided
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
            res.status(201).json({ message: "Client successfully registered!", client: clientResult.rows[0] });
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, email, active } = req.body;

    try {
        const result = await pool.query(
            `UPDATE clients 
             SET name = COALESCE($1, name), email = COALESCE($2, email), active = COALESCE($3, active)
             WHERE id = $4 RETURNING *`,
            [name, email, active, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json({ message: "Client successfully updated", client: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchClients = async (req, res) => {
    const { name, email, client_code } = req.query;

    let query = `SELECT * FROM clients WHERE 1=1`;
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
        query += ` AND client_code = $${count++}`;
        values.push(client_code);
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { registerClient, validatePassword, updateClient, searchClients };
