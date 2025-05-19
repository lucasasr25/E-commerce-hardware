const { Client } = require('../entities/Client');

class ClientBuilderService {
    static buildFromRequest(rawData) {
        const address = {
            adr_type: rawData.adr_type?.[0] || '',
            nick: rawData.nick?.[0] || '',
            street: rawData.street?.[0] || '',
            number: rawData.number?.[0] || '',
            complement: rawData.complement?.[0] || '',
            neighborhood: rawData.neighborhood?.[0] || '',
            city: rawData.city?.[0] || '',
            state: rawData.state?.[0] || '',
            country: rawData.country?.[0] || '',
            zipcode: rawData.zipcode?.[0] || ''
        };

        const creditCard = {
            card_number: rawData.card_number?.[0] || '',
            holder_name: rawData.holder_name?.[0] || '',
            expiration_date: rawData.expiration_date?.[0] || ''
        };

        const clientData = {
            name: rawData.name,
            email: rawData.email,
            password: rawData.password,
            document: rawData.document,
            active: rawData.active === 'on' || rawData.active === true,
            addresses: [address],
            phoneNumbers: rawData.phoneNumbers || [],
            creditCards: [creditCard]
        };

        return new Client(clientData);
    }
}

module.exports = ClientBuilderService;
