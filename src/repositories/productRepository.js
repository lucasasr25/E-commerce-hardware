const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class ProductRepository extends IGenericRepository {

  async getProducts() {
    const result = await pool.query(`
    SELECT DISTINCT ON (p.id)
        p.*,
        s.price,
        pb.profit_margin
    FROM products p
    INNER JOIN (
        SELECT
            product_id,
            SUM(quantity) AS total_quantity,
            MAX(price) AS price
        FROM stock
        GROUP BY product_id
        HAVING SUM(quantity) > 0
    ) s ON s.product_id = p.id
    INNER JOIN price_book pb ON pb.category_id = p.category_id
    INNER JOIN ecommerce_entity ee ON ee.entity_register_id = p.id
    WHERE ee.deleted = FALSE
      AND ee.module_id = 3
      AND s.price > 0;`);
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
