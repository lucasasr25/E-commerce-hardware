const stockRepository = new (require('../../repositories/stockRepository'))('stock');

const manualStockEntryUseCase = async (data) => {
    return await stockRepository.create(data);
};

module.exports = manualStockEntryUseCase;
