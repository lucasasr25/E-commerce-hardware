const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class ReturnStatusRepository extends IGenericRepository {

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM return_statuses ORDER BY id');
    return rows;
  }

  async create({ name, description }) {
    await pool.query(
      'INSERT INTO return_statuses (name, description) VALUES ($1, $2)',
      [name, description || null]
    );
  }

  async delete(id) {
    await pool.query('DELETE FROM return_statuses WHERE id = $1', [id]);
  }
}

module.exports = ReturnStatusRepository;
