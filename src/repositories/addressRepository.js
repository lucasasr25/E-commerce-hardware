const pool = require("../config/db");

const getClientAddresses = async (clientId) => {
    const result = await pool.query(`SELECT * FROM addresses WHERE user_id = $1`, [clientId]);
    return result.rows;
};

const getAddressById = async (addressId) => {
    const result = await pool.query(`SELECT * FROM addresses WHERE id = $1`, [addressId]);
    return result.rows;
};

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

const createAddress = async (userId, address) => {
    const result = await pool.query(
        `INSERT INTO addresses (user_id, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
                userId,
                address.adr_type,
                address.nick,
                address.street,
                address.number,
                address.complement,
                address.neighborhood,
                address.city,
                address.state,
                address.country,
                address.zipcode
            ]
    );
    return result.rows[0];
};

module.exports = {
    getClientAddresses,
    getAddressById,
    updateAddress,
    createAddress
};
