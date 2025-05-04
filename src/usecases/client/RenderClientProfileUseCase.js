const clientRepository = require("../../repositories/clientRepository");
const addressRepository = require("../../repositories/adressRepository");

const RenderClientProfileUseCase = async (req) => {
    const userId = req.session.user?.id;

    const client = await clientRepository.getClientById(userId);
    if (!client) {
        throw new Error('Cliente não encontrado');
    }

    const addresses = await addressRepository.getClientAddresses(userId);
    const cards = await clientRepository.getCreditCardsByUserId(userId);

    return { client, addresses, cards };
}


module.exports = RenderClientProfileUseCase;
