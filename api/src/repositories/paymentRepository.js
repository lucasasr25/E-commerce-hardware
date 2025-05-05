const pool = require('../config/db');

const getAllPaymentStatus = async () => {
    const result = await pool.query("SELECT * FROM payment_status ORDER BY id ASC;");
    return result.rows;
};

const createPaymentStatus = async (status_name) => {
    await pool.query("INSERT INTO payment_status (status_name) VALUES ($1);", [status_name]);
};

const deletePaymentStatus = async (id) => {
    await pool.query("DELETE FROM payment_status WHERE id = $1;", [id]);
};
const getPaymentCardsByOrderId = async (orderId) => {
    const result = await pool.query(`
        SELECT pc.*
        FROM payments p
        JOIN payment_cards pc ON pc.payment_id = p.id
        WHERE p.order_id = $1
    `, [orderId]);
    return result.rows;
};
module.exports = {
    getAllPaymentStatus,
    createPaymentStatus,
    deletePaymentStatus,
    getPaymentCardsByOrderId
};
