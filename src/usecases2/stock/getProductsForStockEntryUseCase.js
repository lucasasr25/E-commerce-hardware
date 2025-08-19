const stockRepository = new (require('../../repositories/stockRepository'))('stock');

const getProductsForStockEntryUseCase = async () => {
    const products = await stockRepository.getAllProductsWithStock();
    return products;
};

const getAllStocks = async () => {
    return await stockRepository.getAll()
}

module.exports = {getProductsForStockEntryUseCase, getAllStocks};
