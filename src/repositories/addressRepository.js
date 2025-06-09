const pool = require("../config/db");
const IGenericRepository = require('./interfaces/IGenericRepository');

class AddressRepository extends IGenericRepository {

    async getClientAddresses (clientId) {
        const result = await pool.query(`SELECT * FROM addresses WHERE user_id = $1`, [clientId]);
        return result.rows;
    };


    async createAddress (userId, address) {
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

    async deleteAddressesByUserId (userId)  {
        try {
            await pool.query(`DELETE FROM addresses WHERE user_id = $1`, [userId]);
        } catch (error) {
            console.error("Erro ao deletar endereços do usuário:", error);
            throw error;
        }
    };

}

module.exports = AddressRepository;
