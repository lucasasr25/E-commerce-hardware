class Supplier {
    constructor({
        id = null,
        name = '',
        tax_id = '',
        phone = '',
        email = '',
        address = '',
        registrationDate = new Date()
    }) {
        this.id = id;
        this.name = name;
        this.tax_id = tax_id;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.registrationDate = new Date(registrationDate);
    }

    toDTO() {
        return {
            ...(this.id !== null && { id: this.id }),
            name: this.name,
            tax_id: this.tax_id,
            phone: this.phone,
            email: this.email,
            address: this.address,
            registration_date: this.registrationDate.toISOString().split('T')[0]
        };
    }
}

module.exports = { Supplier };
