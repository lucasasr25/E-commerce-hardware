class Address {
    constructor({ adr_type, is_default, nick, street, number, complement, neighborhood, city, state, country, zipcode }) {
        Object.assign(this, { adr_type, is_default, nick, street, number, complement, neighborhood, city, state, country, zipcode });
    }
}

class CreditCard {
    constructor({ card_number, holder_name, expiration_date, is_default }) {
        Object.assign(this, { card_number, holder_name, expiration_date, is_default });
    }
}

class Client {
    constructor({ id, name, email, password, document, active = true, phoneNumbers = [], addresses = [], creditCards = [] }) {
        Object.assign(this, { id, name, email, password, document, active, phoneNumbers, addresses, creditCards });
    }
}

module.exports = { Client, Address, CreditCard };
