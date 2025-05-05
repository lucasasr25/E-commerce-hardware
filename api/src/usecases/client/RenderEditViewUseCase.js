const clientRepository = require("../../repositories/clientRepository");

const RenderEditViewUseCase =
    async (req, res) => {
        const { id } = req.query;
        const clients = await clientRepository.searchClients({ id: id });

        if (clients.length === 0) {
            throw new Error('Cliente não encontrado');
        }

        const client = clients[0];
        return {
            client,
            addresses: client.addresses || [],
            phoneNumbers: client.phone_numbers || []
        };
    }


module.exports = RenderEditViewUseCase;
