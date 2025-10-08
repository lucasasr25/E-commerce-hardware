const pool = require("../../config/db");

class IGenericRepository {

  constructor(module = null) {
    if (!module) {
      module = null;
    }
    else{ 
      this.module = module;
    }
  }

  async create(data) {
    console.log(this.module);
    const client = await pool.connect();
    const keys = Object.keys(data);
    const values = Object.values(data);
    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const insertQuery = `INSERT INTO ${this.module} (${columns}) VALUES (${placeholders}) RETURNING id;`;
    try {
      await client.query('BEGIN');
      const result = await client.query(insertQuery, values);
      const newRecordId = result.rows[0].id;
      const moduleResult = await this.getModuleByCode(this.module);
      if (!moduleResult.length) {
        throw new Error(`Módulo com código '${this.module}' não encontrado.`);
      }
      const moduleId = moduleResult[0].id;
      if (this.module) {
        const ecommerceQuery = `
          INSERT INTO ecommerce_entity (module_id, entity_register_id)
          VALUES ($1, $2);
        `;
        await client.query(ecommerceQuery, [moduleId, newRecordId]);
      }
      await client.query('COMMIT');
      return newRecordId;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`Erro ao criar registro em ${this.module}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }

  async getModuleByCode(code) {
      const query = `SELECT * FROM modules WHERE code = $1`;
      const result = await pool.query(query, [code]);
      return result.rows;
  }

  async update(id, entity) {
    throw new Error('Method update() must be implemented.');
  }

  async deleteUpdateEntity(id) {
    try {
      const query = `UPDATE ecommerce_entity SET deleted = TRUE WHERE entity_register_id = $1`;
      await pool.query(query, [id]);
    } catch (error) {
      console.error(`Error deleting record from ecommerce_entity:`, error);
      throw error;
    }
  }


  async delete(id, module, field) {
    try {
      if (!module || !field) {
        throw new Error('Module and field names are required for deletion');
      }

      const query = `DELETE FROM ${module} WHERE ${field} = $1`;
      await pool.query(query, [id]);

    } catch (error) {
      console.error(`Error deleting record from ${module}:`, error);
      throw error;
    }
  }

  async getById(id, module) {
      const query = `SELECT * FROM ${module} WHERE id = $1`;
      const result = await pool.query(query, [id]);
      return result.rows;
  }

  async getByCode(code, module) {
      const query = `SELECT * FROM ${module} WHERE code = $1`;
      const result = await pool.query(query, [code]);
      return result.rows;
  }

  async getAll() {
      const moduleResult = await this.getModuleByCode(this.module);
      if (!moduleResult.length) {
        throw new Error(`Módulo com código '${this.module}' não encontrado.`);
      }
      const moduleId = moduleResult[0].id;
      const query = `SELECT e.* FROM ${this.module} e INNER JOIN ecommerce_entity ee ON e.id = ee.entity_register_id WHERE deleted = FALSE and module_id = ${moduleId}`;
      const result = await pool.query(query);
      return result.rows;
  }
}

module.exports = IGenericRepository;
