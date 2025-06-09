const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require('../config/db');

class PaymentRepository extends IGenericRepository {

  async getAllPaymentStatus() {
    const result = await pool.query("SELECT * FROM payment_status ORDER BY id ASC;");
    return result.rows;
  }

  async createPaymentStatus(status_name) {
    await pool.query("INSERT INTO payment_status (status_name) VALUES ($1);", [status_name]);
  }

  async deletePaymentStatus(id) {
    await pool.query("DELETE FROM payment_status WHERE id = $1;", [id]);
  }

  async getPaymentCardsByOrderId(orderId) {
    const result = await pool.query(`
      SELECT pc.*
      FROM payments p
      JOIN payment_cards pc ON pc.payment_id = p.id
      WHERE p.order_id = $1
    `, [orderId]);
    return result.rows;
  }
}

module.exports = PaymentRepository;
