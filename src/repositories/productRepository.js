const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class ProductRepository extends IGenericRepository {

  async getProducts() {
    const result = await pool.query(`
      SELECT DISTINCT ON (products.id) products.*, stock.price, price_book.profit_margin
      FROM products
      INNER JOIN stock ON stock.product_id = products.id
      INNER JOIN price_book ON price_book.category_id = products.category_id
      INNER JOIN ecommerce_entity ON ecommerce_entity.entity_register_id = products.id
      WHERE ecommerce_entity.deleted = FALSE AND ecommerce_entity.module_id = 3
    `);
    return result.rows;
  }


  async getProductById(id) {
    const result = await pool.query(`
      SELECT DISTINCT ON (products.id) 
        products.*, 
        stock.price, 
        price_book.profit_margin
      FROM products
      INNER JOIN stock ON stock.product_id = products.id
      INNER JOIN price_book ON price_book.category_id = products.category_id
      INNER JOIN ecommerce_entity ON ecommerce_entity.entity_register_id = products.id
      WHERE ecommerce_entity.deleted = FALSE 
        AND ecommerce_entity.module_id = 3 
        AND products.id = $1
    `, [id]);

    return result.rows[0];
  }

  async deleteProduct(id) {
    const result = await pool.query("UPDATE ecommerce_entity SET DELETED = TRUE WHERE entity_register_id = $1", [id]);
    return result.rows[0];
  }

  async updateProduct(id, { name, description, price }) {
    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [name, description, id]
    );
    return result.rows[0];
  }
}

module.exports = ProductRepository;
