const stockRepository = new (require('../../repositories/stockRepository'))();

const reenterStockOnReturnUseCase = async ({ product_id, quantity }) => {
    if (!product_id || quantity == null || quantity <= 0) {
        throw new Error("Produto e quantidade válida são obrigatórios");
    }

    return await stockRepository.reenterStock(product_id, quantity);
};

module.exports = reenterStockOnReturnUseCase;
