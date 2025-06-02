const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class ProductDetailRepository extends IGenericRepository {
  async addProductDetails(product_id, manufacturer, warranty_period, weight, dimensions, color, material) {
    const result = await pool.query(
      "INSERT INTO product_details (product_id, manufacturer, warranty_period, weight, dimensions, color, material) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [product_id, manufacturer, warranty_period, weight, dimensions, color, material]
    );
    return result.rows[0];
  }

  async getProductDetails(product_id) {
    const result = await pool.query(
      "SELECT * FROM product_details WHERE product_id = $1",
      [product_id]
    );
    return result.rows[0];
  }

  async updateProductDetails(id, manufacturer, warranty_period, weight, dimensions, color, material) {
    const result = await pool.query(
      "UPDATE product_details SET manufacturer = $2, warranty_period = $3, weight = $4, dimensions = $5, color = $6, material = $7 WHERE id = $1 RETURNING *",
      [id, manufacturer, warranty_period, weight, dimensions, color, material]
    );
    return result.rows[0];
  }

  async deleteProductDetails(id) {
    const result = await pool.query(
      "DELETE FROM product_details WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = ProductDetailRepository;
