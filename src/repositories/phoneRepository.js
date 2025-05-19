// repositories/phoneRepository.js

const pool  = require("../config/db");

const createPhone = async (userId, phoneNumber) => {
    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO contact_numbers (user_id, phone_number)
             VALUES ($1, $2)`,
            [userId, phoneNumber]
        );
    } catch (error) {
        console.error("Erro ao inserir telefone:", error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createPhone
};
