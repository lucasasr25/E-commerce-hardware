const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require('../config/db');

class ProductCategoryRepository extends IGenericRepository {

  async getByName(name) {
    const result = await pool.query(
      "SELECT * FROM product_category WHERE name = $1;",
      [name]
    );
    return result.rows[0];
  }
}

module.exports = ProductCategoryRepository;
