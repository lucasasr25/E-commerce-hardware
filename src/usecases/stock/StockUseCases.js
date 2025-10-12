class StockUseCases {
  constructor({ stockRepository }) {
    if (!stockRepository) throw new Error("StockRepository é obrigatório");
    this.stockRepository = stockRepository;
  }

  async getProductsForStockEntry() {
    return await this.stockRepository.getAllProductsWithStock();
  }

  async getAllStocks() {
    return await this.stockRepository.getAll();
  }

  async manualStockEntry(product_id, quantity, price, product_supplier_id) {
    return await this.stockRepository.create({ product_id, quantity, price, product_supplier_id });
  }

  async decreaseStockOnSale(products) {
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Produtos inválidos");
    }

    for (let { product_id, quantity } of products) {
      if (!product_id || quantity == null || quantity <= 0) {
        throw new Error("Produto e quantidade válidos são obrigatórios");
      }

      await this.stockRepository.create({ product_id, quantity: -quantity });
    }
  }

  async reenterStockOnReturn({ product_id, quantity }) {
    if (!product_id || quantity == null || quantity <= 0) {
      throw new Error("Produto e quantidade válidos são obrigatórios");
    }

    return await this.stockRepository.create({ product_id, quantity });
  }
}

module.exports = StockUseCases;
