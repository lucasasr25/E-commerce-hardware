const masterTableRepository = require("../repositories/masterTableRepository");

class MasterTableUseCase {
  /**
   * @param {Object} params 
   * @param {number} params.moduleId
   * @param {number} params.entityRegisterId
   */
  async insert({ moduleId, entityRegisterId }) {
    if (!entityRegisterId) throw new Error("entityRegisterId é obrigatório.");
    if (!moduleId) throw new Error("moduleId é obrigatório.");

    try {
      const inserted = await masterTableRepository.insert(moduleId, entityRegisterId);
      return inserted; // { id: ... }
    } catch (err) {
      console.error("Erro ao inserir na tabela ecommerce_entity:", err);
      throw new Error("Erro ao registrar entidade na tabela mestra.");
    }
  }
}

module.exports = new MasterTableUseCase();
