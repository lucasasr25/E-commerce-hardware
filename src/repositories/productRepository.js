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
      SELECT 
          p.id, 
          p.name, 
          p.description, 
          SUM(s.quantity) AS total_quantity
      FROM 
          products p
      LEFT JOIN 
          stock s ON p.id = s.product_id
      INNER JOIN 
          ecommerce_entity e ON e.entity_register_id = p.id
      WHERE 
          e.deleted = FALSE
          AND p.id = $1
      GROUP BY 
          p.id, p.name, p.description;
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
