const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require('../config/db');

class PriceBookRepository extends IGenericRepository {
  async getByCategoryId(categoryId) {
    const result = await pool.query(
      `SELECT * FROM price_book WHERE category_id = $1;`,
      [categoryId]
    );
    return result.rows;
  }
}

module.exports = PriceBookRepository;
