const productRepository = require('../../repositories/productRepository');

const getProductsUseCase = async (req, res) => {

    const products = await productRepository.getProducts();

    return products;
};

module.exports = getProductsUseCase;
