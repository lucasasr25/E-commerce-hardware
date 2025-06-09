const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class OrderStatusRepository extends IGenericRepository {


  async getStatusID(statusName) {
    const result = await pool.query(
      "SELECT id FROM order_status WHERE status_name = $1",
      [statusName]
    );
    return result.rows[0]; // retorna o objeto { id: ... } ou undefined se não achar
  }
}

module.exports = OrderStatusRepository;
