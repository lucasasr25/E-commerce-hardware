const { Client } = require('../entities/Client');

class ClientBuilderService {
    static buildFromRequest(rawData) {
        const addresses = [];
        const addressCount = Array.isArray(rawData.street) ? rawData.street.length : 0;
        for (let i = 0; i < addressCount; i++) {
            addresses.push({
                adr_type: rawData.adr_type?.[i] || '',
                nick: rawData.nick?.[i] || '',
                street: rawData.street?.[i] || '',
                number: rawData.number?.[i] || '',
                complement: rawData.complement?.[i] || '',
                neighborhood: rawData.neighborhood?.[i] || '',
                city: rawData.city?.[i] || '',
                state: rawData.state?.[i] || '',
                country: rawData.country?.[i] || '',
                zipcode: rawData.zipcode?.[i] || '',
                is_default: rawData.is_default?.[i] === 'true' || false 
            });
        }
        const creditCards = [];
        const cardCount = Array.isArray(rawData.card_number) ? rawData.card_number.length : 0;
        for (let i = 0; i < cardCount; i++) {
            creditCards.push({
                card_number: rawData.card_number?.[i] || '',
                holder_name: rawData.holder_name?.[i] || '',
                expiration_date: rawData.expiration_date?.[i] || ''
            });
        }
        const clientData = {
            id: rawData.id,
            name: rawData.name,
            email: rawData.email,
            password: rawData.password,
            document: rawData.document,
            active: rawData.active === 'on' || rawData.active === true,
            addresses,
            phoneNumbers: rawData.phoneNumbers || [],
            creditCards
        };

        return new Client(clientData);
    }
}

module.exports = ClientBuilderService;
