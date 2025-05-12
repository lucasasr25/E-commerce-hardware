const stockRepository = require('../../repositories/stockRepository');

// Obtém todos os produtos com as quantidades no estoque
const getProductsForStockEntryUseCase = async () => {
    const products = await stockRepository.getAllProductsWithStock();
    return products;
};

module.exports = getProductsForStockEntryUseCase;
