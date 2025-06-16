const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class StockRepository extends IGenericRepository {
  async getAllProductsWithStock() {
    const query = `
      SELECT 
          p.id, 
          p.name, 
          p.description, 
          s.price, 
          SUM(s.quantity) AS quantity
      FROM 
          products p
      LEFT JOIN 
          stock s ON p.id = s.product_id
      INNER JOIN 
          ecommerce_entity e ON e.entity_register_id = p.id
      WHERE 
          e.deleted = FALSE
      GROUP BY 
          p.id, p.name, p.description, s.price;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async reenterStock(product_id, quantity) {
    return await this.addStock(product_id, quantity);
  }
}

module.exports = StockRepository;
