const productRepository = new (require("../../repositories/orderRepository"))('price_book');

const getAllPriceBook = async () => {
    return await productRepository.getAll()
};

const createPriceBook = async (data) => {
    return await productRepository.create(data)
};

const deletePriceBook = async (id) => {
    return await productRepository.deleteUpdateEntity(id);

};

module.exports = {
    getAllPriceBook, createPriceBook, deletePriceBook
};
