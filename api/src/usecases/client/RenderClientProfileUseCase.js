const clientRepository = require("../../repositories/clientRepository");
const addressRepository = require("../../repositories/addressRepository");

const RenderClientProfileUseCase = async (userId) => {


    const client = await clientRepository.getClientById(userId);
    if (!client) {
        throw new Error('Cliente não encontrado');
    }

    const addresses = await addressRepository.getClientAddresses(userId);
    const cards = await clientRepository.getCreditCardsByUserId(userId);

    return { client, addresses, cards };
}


module.exports = RenderClientProfileUseCase;
