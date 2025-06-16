class Product {
    constructor({ id, name, description, category_id}) {
        this.validateName(name);
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.category_id = category_id;
    }

    validateName(name) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Product name is required and must be a non-empty string.');
        }
    }

    toDTO() {
        const dto = {
            name: this.name,
            description: this.description,
            category_id: this.category_id
        };

        if (this.id != null) { 
            dto.id = this.id;
        }

        return dto;
    }
}

class ProductDetail {
    constructor({
        product_id,
        manufacturer,
        warranty_period,
        weight,
        dimensions,
        color,
        material
    }) {
        this.product_id = product_id;
        this.manufacturer = manufacturer || '';
        this.warranty_period = warranty_period || '';
        this.weight = weight || '';
        this.dimensions = dimensions || '';
        this.color = color || '';
        this.material = material || '';
    }

    toDTO() {
        return {
            product_id: this.product_id,
            manufacturer: this.manufacturer,
            warranty_period: this.warranty_period,
            weight: this.weight,
            dimensions: this.dimensions,
            color: this.color,
            material: this.material
        };
    }
}

class Stock {
    constructor(qtd, product_id, price, supplier_id) {
        this.quantity = this.validateQuantity(qtd);
        this.product_id = product_id;
        this.price = this.validatePrice(price);
        this.supplier_id = supplier_id;
    }

    validateQuantity(qtd) {
        if (qtd === undefined || isNaN(qtd) || parseInt(qtd) < 0) {
            throw new Error('Stock quantity must be a number greater than or equal to 0.');
        }
        return parseInt(qtd);
    }

    validatePrice(price) {
        if (price === undefined || isNaN(price) || Number(price) < 0) {
            throw new Error('Price must be a number greater than or equal to 0.');
        }
        return Number(price);
    }

    toDTO() {
        return {
            quantity: this.quantity,
            product_id: this.product_id,
            product_supplier_id: this.supplier_id,
            price: Number(this.price)
        };
    }
}

module.exports = {
    Product,
    ProductDetail,
    Stock
};
