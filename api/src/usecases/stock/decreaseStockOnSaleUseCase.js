const stockRepository = require('../../repositories/stockRepository');

const decreaseStockOnSaleUseCase = async ({ product_id, quantity }) => {
    if (!product_id || quantity == null || quantity <= 0) {
        throw new Error("Produto e quantidade válida são obrigatórios");
    }

    return await stockRepository.removeStock(product_id, quantity);
};

module.exports = decreaseStockOnSaleUseCase;
