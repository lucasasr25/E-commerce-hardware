const pool = require("../config/db");

// Função para obter os endereços de um cliente
const getClientAddresses = async (clientId) => {
    const result = await pool.query(
        `SELECT * FROM addresses WHERE user_id = $1`,
        [clientId]
    );
    return result.rows;
};

// Função para atualizar os endereços do cliente
const updateAddress = async (id, adr_type, nick, userId, street, number, complement, neighborhood, city, state, country, zipcode) => {
    const result = await pool.query(
        `UPDATE addresses
         SET adr_type = COALESCE($1, adr_type), 
             nick = COALESCE($2, nick), 
             street = COALESCE($3, street), 
             number = COALESCE($4, number), 
             complement = COALESCE($5, complement), 
             neighborhood = COALESCE($6, neighborhood), 
             city = COALESCE($7, city), 
             state = COALESCE($8, state), 
             country = COALESCE($9, country), 
             zipcode = COALESCE($10, zipcode)
         WHERE id = $11 AND user_id = $12 RETURNING *`,
        [adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode, id, userId]
    );

    return result.rowCount ? result.rows[0] : null;
};

// Função para criar um novo endereço para o cliente
const createAddress = async (userId, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode) => {
    const result = await pool.query(
        `INSERT INTO addresses (user_id, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [userId, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode]
    );

    return result.rows[0];
};


module.exports = {updateAddress, getClientAddresses, createAddress};


