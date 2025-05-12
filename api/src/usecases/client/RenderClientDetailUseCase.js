const clientRepository = require("../../repositories/clientRepository");

const RenderClientDetailUseCase =
    async (id) => {
        const client = await clientRepository.getClientById(id);
        
        if (!client) {
            throw new Error("Cliente não encontrado.");
        }
        
        return client;
    }


module.exports = RenderClientDetailUseCase;
