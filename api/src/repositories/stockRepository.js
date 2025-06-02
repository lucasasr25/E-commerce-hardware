const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class StockRepository extends IGenericRepository {
  async createStock(product_id, quantity) {
    const query = `
      INSERT INTO stock (product_id, quantity)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [product_id, quantity];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async getAllProductsWithStock() {
    const query = `
      SELECT p.id, p.name, p.description, p.price, s.quantity
      FROM products p
      LEFT JOIN stock s ON p.id = s.product_id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async addStock(product_id, quantity) {
    const updateQuery = `
      UPDATE stock
      SET quantity = quantity + $1
      WHERE product_id = $2
      RETURNING *;
    `;
    const values = [quantity, product_id];
    const { rows } = await pool.query(updateQuery, values);

    if (rows.length === 0) {
      return await this.createStock(product_id, quantity);
    }
    return rows[0];
  }

  async removeStock(product_id, quantity) {
    const query = `
      UPDATE stock
      SET quantity = quantity - $1
      WHERE product_id = $2 AND quantity >= $1
      RETURNING *;
    `;
    const values = [quantity, product_id];
    const { rows } = await pool.query(query, values);

    if (!rows[0]) throw new Error("Estoque insuficiente ou produto inexistente");

    return rows[0];
  }

  async reenterStock(product_id, quantity) {
    return await this.addStock(product_id, quantity);
  }
}

module.exports = StockRepository;
