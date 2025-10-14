const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class StockRepository extends IGenericRepository {

  constructor() {
    super();
    this.module = 'stock';
  }

  async getProductByID(id) {
    const query = `
  SELECT 
      p.id, 
      p.name, 
      p.description, 
      SUM(s.quantity) AS quantity
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
    `;
    
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error(`Produto com id ${id} não encontrado`);
    }

    return result.rows[0];
  }

  async getAllProductsWithStock() {
    const query = `
      SELECT 
          p.id, 
          p.name, 
          p.description, 
          s.price, 
          s.quantity
      FROM 
          products p
      LEFT JOIN 
          stock s ON p.id = s.product_id
      INNER JOIN 
          ecommerce_entity e ON e.entity_register_id = p.id
      WHERE 
          e.deleted = FALSE
      GROUP BY 
          p.id, p.name, p.description, s.price, s.quantity;
    `;

    const result = await pool.query(query);
    return result.rows;
  }


  async getAll() {
    const query = `
      SELECT 
          p.name,
          p.id, 
          SUM(s.quantity) AS total_quantity
      FROM 
          products p
      LEFT JOIN 
          stock s ON p.id = s.product_id
      INNER JOIN 
          ecommerce_entity e ON e.entity_register_id = p.id
      WHERE 
          e.deleted = FALSE
      GROUP BY 
          p.id;
    `;
        console.log(result);

    const result = await pool.query(query);
    return result.rows;
}


  
async decreaseStock(items) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const item of items) {
      const { product_id, quantity } = item;

      const { rows } = await client.query(
        `SELECT SUM(quantity) AS total_quantity
         FROM stock
         WHERE product_id = $1
         GROUP BY product_id`,
        [product_id]
      );

      const totalQuantity = rows[0] ? parseInt(rows[0].total_quantity, 10) : 0;
      if (totalQuantity < quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product_id}`);
      }

      await this.reenterStock(product_id, -quantity);
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

  async reenterStock(product_id, quantity) {
    return await this.create({ product_id, quantity });
  }
}

module.exports = StockRepository;
