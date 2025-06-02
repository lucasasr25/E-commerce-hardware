const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require("../config/db");

class PhoneRepository extends IGenericRepository {
  async createPhone(userId, phoneNumber) {
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO contact_numbers (user_id, phone_number)
         VALUES ($1, $2)`,
        [userId, phoneNumber]
      );
    } catch (error) {
      console.error("Erro ao inserir telefone:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deletePhonesByUserId(userId) {
    const client = await pool.connect();
    try {
      await client.query(
        `DELETE FROM contact_numbers WHERE user_id = $1`,
        [userId]
      );
    } catch (error) {
      console.error("Erro ao deletar telefones do usuário:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = PhoneRepository;
