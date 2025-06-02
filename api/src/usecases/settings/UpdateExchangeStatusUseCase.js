const exchangeRepository = new (require('../../repositories/returnRepository'))();

class UpdateExchangeStatusUseCase {
    async execute(id, newStatus) {
        if (!id || !newStatus) {
            throw new Error("ID e novo status são obrigatórios.");
        }

        const updated = await exchangeRepository.updateStatusById(id, newStatus);
        if (!updated) {
            throw new Error("Troca não encontrada ou não foi possível atualizar.");
        }

        return updated;
    }
}

module.exports = new UpdateExchangeStatusUseCase();
