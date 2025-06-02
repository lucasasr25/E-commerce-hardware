const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class ProductRepository extends IGenericRepository {
  async createProduct(name, description, price) {
    const result = await pool.query(
      "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    return result.rows[0];
  }

  async getProducts() {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
  }

  async getProductById(id) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0];
  }

  async deleteProduct(id) {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }

  async updateProduct(id, { name, description, price }) {
    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3
       WHERE id = $4
       RETURNING *`,
      [name, description, price, id]
    );
    return result.rows[0];
  }
}

module.exports = ProductRepository;
