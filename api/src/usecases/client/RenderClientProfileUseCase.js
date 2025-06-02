const clientRepository = new (require("../../repositories/clientRepository"))();
const addressRepository = new (require("../../repositories/addressRepository"))();
const creditCardRepository = new (require("../../repositories/creditCardRepository"))();


const RenderClientProfileUseCase = async (userId) => {


    const client = await clientRepository.getClientById(userId);
    if (!client) {
        throw new Error('Cliente não encontrado');
    }

    const addresses = await addressRepository.getClientAddresses(userId);
    const cards = await creditCardRepository.getCreditCardsByUserId(userId);

    return { client, addresses, cards };
}


module.exports = RenderClientProfileUseCase;
