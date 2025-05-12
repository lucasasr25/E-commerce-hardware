const clientRepository = require("../../repositories/clientRepository");

const DeleteClientUseCase =
    async (id) => {

        const client = await clientRepository.deleteClient(id);
        
        if (!client) {
            throw new Error("Cliente não encontrado.");
        }

        return client;
}

module.exports = DeleteClientUseCase;
