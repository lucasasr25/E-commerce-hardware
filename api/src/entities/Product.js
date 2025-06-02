class Product {
    constructor({ id, name, description, price }) {
        this.validateName(name);
        this.validatePrice(price);

        this.id = id;
        this.name = name;
        this.description = description || '';
        this.price = parseFloat(Number(price).toFixed(2));
    }

    validateName(name) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Product name is required and must be a non-empty string.');
        }
    }

    validatePrice(price) {
        if (price === undefined || isNaN(price) || parseFloat(price) <= 0) {
            throw new Error('Price must be a number greater than 0.');
        }
    }
}

class ProductDetail {
    constructor({
        manufacturer,
        warranty_period,
        weight,
        dimensions,
        color,
        material
    }) {
        this.manufacturer = manufacturer || '';
        this.warranty_period = warranty_period || '';
        this.weight = weight || '';
        this.dimensions = dimensions || '';
        this.color = color || '';
        this.material = material || '';
    }
}

class Stock {
    constructor(qtd) {
        this.quantity = this.validateQuantity(qtd);
    }

    validateQuantity(qtd) {
        if (qtd === undefined || isNaN(qtd) || parseInt(qtd) < 0) {
            throw new Error('Stock quantity must be a number greater than or equal to 0.');
        }
        return parseInt(qtd);
    }
}

module.exports = {
    Product,
    ProductDetail,
    Stock
};
