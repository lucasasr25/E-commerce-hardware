const stockRepository = new (require('../../repositories/stockRepository'))();

class StockUseCases {
  constructor() {
    this.stockRepository = stockRepository;
  }

  // Obter todos os produtos com quantidade no estoque
  async getProductsForStockEntry() {
    return await this.stockRepository.getAllProductsWithStock();
  }

  // Obter todos os registros de estoque
  async getAllStocks() {
    return await this.stockRepository.getAll();
  }

  async manualStockEntry(product_id, quantity, price, product_supplier_id) {
    return await this.stockRepository.create({product_id, quantity, price, product_supplier_id});
  }

    async decreaseStockOnSale(products) {
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error("Produtos inválidos");
        }

        for (let product of products) {
            let { product_id, quantity } = product;  // Use 'let' here to allow reassignment

            if (!product_id || quantity == null || quantity <= 0) {
                throw new Error("Produto e quantidade válidos são obrigatórios");
            }

            // Decrease quantity by multiplying by -1
            quantity = -1 * quantity;

            // Assuming 'create' method will handle negative quantities correctly for stock decrease
            await this.stockRepository.create({ product_id, quantity });
        }
    }
  // Reentrar o estoque em caso de devolução
  async reenterStockOnReturn({ product_id, quantity }) {
    if (!product_id || quantity == null || quantity <= 0) {
      throw new Error("Produto e quantidade válidos são obrigatórios");
    }

    return await this.stockRepository.create(product_id, quantity);
  }
}

module.exports = StockUseCases;
