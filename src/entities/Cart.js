const { Product } = require('./Product'); // importe sua entidade

class Cart {
    constructor(userId, itemsFromDb = []) {
        if (!userId) throw new Error("User ID is required");
        this.userId = userId;

        this.items = itemsFromDb.map(dbItem => {
            const product = new Product({
                id: Number(dbItem.product_id),
                name: dbItem.name,
                price: Number(dbItem.base_price) + (Number(dbItem.base_price) * (Number(dbItem.profit_margin) / 100)),
                description: '' 
            });
            return {
                productId: Number(product.id),
                name: product.name,
                price: Number(dbItem.base_price) + (Number(dbItem.base_price) * (Number(dbItem.profit_margin) / 100)) || 0, 
                quantity: Number(dbItem.quantity) || 0
            };
        });
    }


    addItem(product) {
        if (!(product instanceof Product)) {
            throw new Error("Produto inválido: deve ser uma instância de Product.");
        }

        const existingItem = this.items.find(item => item.productId === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
    }

    updateQuantity(productId, quantity) {
        productId = Number(productId);
        quantity = Number(quantity);

        if (quantity <= 0) {
            this.removeItem(productId);
        } else {
            const item = this.items.find(i => i.productId === productId);
            if (!item) throw new Error("Item não encontrado no carrinho.");
            item.quantity = quantity;
        }
    }


    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
    }

    clear() {
        this.items = [];
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    toJSON() {
        return {
            userId: this.userId,
            items: this.items,
            total: this.getTotal()
        };
    }
}

module.exports = Cart;
