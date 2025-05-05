const pool = require('../config/db');

// Função para criar um cupom promocional
const createCoupon = async (code, discountPercentage, expirationDate) => {
    const result = await pool.query(
        'INSERT INTO promotional_coupons (code, discount_percentage, expiration_date) VALUES ($1, $2, $3) RETURNING *',
        [code, discountPercentage, expirationDate]
    );
    return result.rows[0];
};

// Função para deletar um cupom promocional
const deleteCoupon = async (id) => {
    const result = await pool.query(
        'DELETE FROM promotional_coupons WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Função para obter todos os cupons promocionais
const getAllCoupons = async () => {
    const result = await pool.query('SELECT * FROM promotional_coupons ORDER BY expiration_date DESC');
    return result.rows;
};

const getCoupon = async (code) => {
    const result = await pool.query(
        'SELECT * FROM promotional_coupons WHERE code = $1',
        [code]
    );
    return result.rows[0];
};


module.exports = {
    getCoupon,
    createCoupon,
    deleteCoupon,
    getAllCoupons
};
