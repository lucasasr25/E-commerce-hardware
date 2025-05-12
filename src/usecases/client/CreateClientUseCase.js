const clientRepository = require("../../repositories/clientRepository");
const addressRepository = require("../../repositories/addressRepository");

const CreateClientUseCase = async (clientData) => {
    const { name, email, password, document, active, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode, phoneNumbers, card_number, holder_name, expiration_date } = clientData;

    const addresses = adr_type.map((type, i) => ({
        adr_type: type || '',
        nick: nick[i] || '',
        street: street[i] || '',
        number: number[i] || '',
        complement: complement[i] || '',
        neighborhood: neighborhood[i] || '',
        city: city[i] || '',
        state: state[i] || '',
        country: country[i] || '',
        zipcode: zipcode[i] || ''
    }));

    const newClient = await clientRepository.createClient(name, email, password, document, active);

    if (!newClient) {
        throw new Error('Erro ao criar cliente');
    }

    await Promise.all(addresses.map((address) => {
        return addressRepository.createAddress(newClient.id, address.adr_type, address.nick, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, address.country, address.zipcode);
    }));

    if (phoneNumbers && phoneNumbers.length > 0) {
        await Promise.all(phoneNumbers.map((phoneNumber) => {
            return clientRepository.createPhone(newClient.id, phoneNumber);
        }));
    }

    if (card_number && holder_name && expiration_date) {
        await Promise.all(card_number.map((num, i) => {
            return clientRepository.createCreditCard(newClient.id, num, holder_name[i], expiration_date[i]);
        }));
    }

    return newClient;
}
module.exports = CreateClientUseCase;
