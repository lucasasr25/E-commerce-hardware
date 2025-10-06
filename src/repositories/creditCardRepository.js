const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class CreditCardRepository extends IGenericRepository {
    async createCard(userId, card) {
        const { card_number, holder_name, expiration_date, is_default } = card;
        await pool.query(
            `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, is_default)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, card_number, holder_name, expiration_date, is_default]
        );
    }

    // Cria cartão passando parâmetros separados
    async createCreditCard(userId, cardNumber, holderName, expirationDate, is_default_) {
        await pool.query(
            `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, is_default)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, cardNumber, holderName, expirationDate, is_default_]
        );
    }

    // Insere ou atualiza cartão (upsert)
    async updateCreditCard(userId, cardNumber, holderName, expirationDate, isDefault) {

        console.log(isDefault);
        await pool.query(
            `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, is_default)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, card_number)
            DO UPDATE SET 
                holder_name = EXCLUDED.holder_name,
                expiration_date = EXCLUDED.expiration_date,
                is_default = EXCLUDED.is_default`,
            [userId, cardNumber, holderName, expirationDate, isDefault]
        );
    }

    // Retorna cartões do usuário
    async getCreditCardsByUserId(userId) {
        const result = await pool.query(
            `SELECT id, card_number, holder_name, expiration_date, is_default
             FROM credit_cards 
             WHERE user_id = $1`,
            [userId]
        );
        return result.rows;
    }

    // Deleta cartão pelo id
    async deleteCreditCard(cardId) {
        const result = await pool.query(`DELETE FROM credit_cards WHERE id = $1`, [cardId]);
        if (result.rowCount === 0) throw new Error("Cartão não encontrado");
    }
}

module.exports = CreditCardRepository;
