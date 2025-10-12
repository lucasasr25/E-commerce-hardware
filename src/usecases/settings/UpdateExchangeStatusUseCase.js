class UpdateExchangeStatusUseCase {
    constructor({ exchangeRepository }) {
        this.exchangeRepository = exchangeRepository;
    }

    async execute(id, newStatus) {
        if (!id || !newStatus) {
            throw new Error("ID e novo status são obrigatórios.");
        }

        const updated = await this.exchangeRepository.updateStatusById(id, newStatus);
        if (!updated) {
            throw new Error("Troca não encontrada ou não foi possível atualizar.");
        }

        return updated;
    }
}

module.exports = UpdateExchangeStatusUseCase;
