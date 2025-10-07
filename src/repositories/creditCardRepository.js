const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class CreditCardRepository extends IGenericRepository {
    async createCard(userId, card) {
        const { card_number, holder_name, expiration_date, flag, is_default } = card;
        await pool.query(
            `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, flag, is_default)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, card_number, holder_name, expiration_date, flag, is_default]
        );
    }

    // Cria cartão passando parâmetros separados
    async createCreditCard(userId, cardNumber, holderName, expirationDate, flag, is_default_) {
        await pool.query(
            `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, flag, is_default)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, cardNumber, holderName, expirationDate, flag, is_default_]
        );
    }

    // Insere ou atualiza cartão (upsert)
    async updateCreditCard(userId, cardNumber, holderName, expirationDate, flag, isDefault) {        
        await pool.query(
            `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, flag, is_default)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, card_number)
            DO UPDATE SET 
                holder_name = EXCLUDED.holder_name,
                expiration_date = EXCLUDED.expiration_date,
                flag = EXCLUDED.flag,
                is_default = EXCLUDED.is_default`,
            [userId, cardNumber, holderName, expirationDate, flag, isDefault]
        );
    }

    // Retorna cartões do usuário
    async getCreditCardsByUserId(userId) {
        const result = await pool.query(
            `SELECT id, card_number, holder_name, expiration_date, flag, is_default
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
