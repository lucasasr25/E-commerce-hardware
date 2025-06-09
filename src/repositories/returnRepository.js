const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class ReturnRepository extends IGenericRepository {

  async createReturn({ user_id, order_id, product_id, trade_coupon_id, quantity }) {
    const query = `
      INSERT INTO returns (user_id, order_id, product_id, quantity, trade_coupon_id, return_status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      user_id,
      order_id,
      product_id,
      quantity,
      trade_coupon_id,
      2 // status inicial
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async updateStatusById(id, newStatus) {
    const result = await pool.query(
      `UPDATE returns SET return_status_id = $1 WHERE id = $2 RETURNING *`,
      [newStatus, id]
    );
    return result.rowCount ? result.rows[0] : null;
  }

  async getReturnsByUserId(userId) {
    const query = `
      SELECT r.*, 
             p.name AS product_name,
             rs.name AS status_name,
             rs.description AS status_description,
             o.id AS order_id,
             o.created_at AS order_date,
             o.total_price AS order_total,
             os.status_name AS order_status,
             tc.code
      FROM returns r
      JOIN trade_coupons tc ON tc.id = r.trade_coupon_id
      JOIN products p ON r.product_id = p.id
      JOIN return_statuses rs ON r.return_status_id = rs.id
      JOIN orders o ON r.order_id = o.id
      JOIN order_status os ON o.status_id = os.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
}

module.exports = ReturnRepository;
