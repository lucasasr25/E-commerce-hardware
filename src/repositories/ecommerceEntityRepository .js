const pool = require("../../config/db");

class EcommerceEntityRepository extends IGenericRepository {
  async saveToEntity(entity_register_id, module_id) {
    const query = `
      INSERT INTO ecommerce_entity (module_id, entity_register_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [module_id, entity_register_id]);
    return result.rows;
  }
}

module.exports = EcommerceEntityRepository;
