const productRepository = new (require('../../repositories/productRepository'))();

const getProductsUseCase = async () => {

    const products = await productRepository.getProducts();

    return products;
};

module.exports = getProductsUseCase;
