const pool = require("../../config/db");

class IGenericRepository {

  constructor(module = null) {
    if (!module) {
      module = null;
    }
    else{ this.module = module;}
  }

  async create(data, entity) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${entity} (${columns}) VALUES (${placeholders});`;
    await pool.query(query, values);
  }

  async update(id, entity) {
    throw new Error('Method update() must be implemented.');
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
    throw new Error('Method getAll() must be implemented.');
  }
}

module.exports = IGenericRepository;
