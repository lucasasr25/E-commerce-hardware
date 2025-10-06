class Order {
    constructor({ cliente, endereco, items, promotionalCoupon, pagamentosCartao }) {
        if (!cliente) throw new Error("Cliente é obrigatório");
        if (!endereco) throw new Error("Endereço padrão é obrigatório");
        if (!items?.length) throw new Error("Carrinho está vazio");

        this.cliente = cliente;
        this.endereco = endereco;

        // Calcula o preço final dos itens com base na margem de lucro
        if(this.items.length == 0){
            
            throw new Error(`Carrinho Vazio`);
        }
        this.items = items.map(item => {
            const basePrice = parseFloat(item.base_price);
            const margin = parseFloat(item.profit_margin) / 100;
            const finalPrice = basePrice + (basePrice * margin);

            return {
                ...item,
                price: finalPrice
            };
        });

        this.promotionalCoupon = promotionalCoupon;
        this.pagamentosCartao = this.formatarCartoes(pagamentosCartao);

        this.subtotal = this.calcularSubtotal();
        this.valorCupom = this.calcularDesconto();
        this.frete = 50;
        this.total = this.subtotal - this.valorCupom + this.frete;

        this.validarPagamento();
    }

    formatarCartoes(pagamentosCartao) {
        return Object.values(pagamentosCartao || {}).map(c => ({
            id: parseInt(c.id),
            valor: parseFloat(c.valor)
        }));
    }

    calcularSubtotal() {
        return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    calcularDesconto() {
        if (!this.promotionalCoupon) return 0;
        return this.subtotal * (this.promotionalCoupon.discount_percentage / 100);
    }

    validarPagamento() {
        const totalCartoes = this.pagamentosCartao.reduce((acc, c) => acc + c.valor, 0);
        const diff = Math.abs(totalCartoes - this.total);

        if (diff > 0.01) {
            throw new Error(`A soma dos cartões (${totalCartoes.toFixed(2)}) não bate com o total da compra (${this.total.toFixed(2)}).`);
        }

        for (const [index, c] of this.pagamentosCartao.entries()) {
            if (isNaN(c.valor)) throw new Error(`Valor inválido no cartão ${index + 1}`);
            if (c.valor < 10 && this.valorCupom <= 0) {
                throw new Error(`Cartão ${index + 1} deve ter valor mínimo de R$10 ou parte do pagamento deve ser com cupom`);
            }
        }
    }

    getOrderData() {
        return {
            userId: this.cliente.id,
            couponId: this.promotionalCoupon?.id || null,
            enderecoId: this.endereco.id,
            status: 2,
            subtotal: this.subtotal,
            total: this.total,
            items: this.items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            })),
            cartoes: this.pagamentosCartao
        };
    }
}

module.exports = {
    Order
};
