const pool = require("../config/db");


const createCard = async (userId, card) => {
    const { card_number, holder_name, expiration_date, is_default } = card;
    await pool.query(
        `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, is_default)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, card_number, holder_name, expiration_date, is_default]
    );
};

const createCreditCard = async (userId, cardNumber, holderName, expirationDate, is_default_) => {
    await pool.query(
        `INSERT INTO credit_cards (user_id, card_number, holder_name, expiration_date, is_default)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, cardNumber, holderName, expirationDate, is_default_]
    );
};

const updateCreditCard = async (userId, cardNumber, holderName, expirationDate, isDefault) => {
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
};

const getCreditCardsByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT id, card_number, holder_name, expiration_date 
         FROM credit_cards 
         WHERE user_id = $1`,
        [userId]
    );
    return result.rows;
};

const deleteCreditCard = async (cardId) => {
    const result = await pool.query(`DELETE FROM credit_cards WHERE id = $1`, [cardId]);
    if (result.rowCount === 0) throw new Error("Cartão não encontrado");
};

module.exports = {
    createCreditCard,
    updateCreditCard,
    getCreditCardsByUserId,
    deleteCreditCard,
    createCard
};
