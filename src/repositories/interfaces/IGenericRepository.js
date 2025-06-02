const pool = require("../../config/db");

class IGenericRepository {
  async create(entity) {
    throw new Error('Method create() must be implemented.');
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
