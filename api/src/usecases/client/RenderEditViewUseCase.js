const clientRepository = new (require("../../repositories/clientRepository"))();

const RenderEditViewUseCase =
    async (id) => {

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
