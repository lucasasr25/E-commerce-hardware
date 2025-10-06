class Address {
    constructor({
        adr_type = '',
        nick = '',
        street = '',
        number = '',
        complement = '',
        neighborhood = '',
        city = '',
        state = '',
        country = '',
        zipcode = '',
        is_default = false
    }) {
        this.adr_type = adr_type;
        this.nick = nick;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipcode = zipcode;
        this.is_default = is_default === 'true' || is_default === true;
    }

    toDTO() {
        return {
            adr_type: this.adr_type,
            nick: this.nick,
            street: this.street,
            number: this.number,
            complement: this.complement,
            neighborhood: this.neighborhood,
            city: this.city,
            state: this.state,
            country: this.country,
            zipcode: this.zipcode,
            is_default: this.is_default
        };
    }
}


class CreditCard {
    constructor({
        card_number = '',
        holder_name = '',
        expiration_date = '',
        is_default = false
    }) {
        this.card_number = card_number;
        this.holder_name = holder_name;
        this.expiration_date = expiration_date;
        this.is_default = !!is_default; // garante boolean
    }

    toDTO() {
        return {
            card_number: this.card_number,
            holder_name: this.holder_name,
            expiration_date: this.expiration_date,
            is_default: this.is_default
        };
    }
}

class Client {
    constructor({
        id = null,
        name = '',
        email = '',
        password = '',
        document = '',
        active = true,
        addresses = [],
        phoneNumbers = [],
        creditCards = []
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.document = document;
        this.active = active;
        this.addresses = addresses.map(addr => new Address(addr));
        this.phoneNumbers = phoneNumbers;
        this.creditCards = creditCards.map(card => new CreditCard(card));

        const defaultAddresses = addresses.filter(addr => addr.is_default);
        if (defaultAddresses.length > 1) {
            throw new Error('Não pode haver mais de um endereço como "default"');
        }
    }

    toDTO() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            document: this.document,
            active: this.active
        };
    }

    getAddressesDTO() {
        return this.addresses.map(addr => addr.toDTO());
    }

    getCreditCardsDTO() {
        return this.creditCards.map(card => card.toDTO());
    }

    getPhoneNumbers() {
        return this.phoneNumbers;
    }
}


module.exports = { Client, Address, CreditCard };
