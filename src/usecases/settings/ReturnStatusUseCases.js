const ReturnStatusRepository = require('../../repositories/returnStatusRepository');

class ReturnStatusUseCases {
  constructor() {
    this.returnStatusRepository = new ReturnStatusRepository();
  }

  async getAllReturnStatus() {
    return await this.returnStatusRepository.findAll();
  }

  async createReturnStatus(name, description) {
    if (!name) {
      throw new Error("Nome do status é obrigatório.");
    }
    return await this.returnStatusRepository.create({ name, description });
  }

  async deleteReturnStatus(id) {
    if (!id) {
      throw new Error("ID inválido para exclusão.");
    }
    return await this.returnStatusRepository.delete(id);
  }
}

module.exports = ReturnStatusUseCases;
