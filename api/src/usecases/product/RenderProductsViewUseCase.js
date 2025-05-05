const productRepository = require("../../repositories/productRepository");

const renderProductsViewUseCase = async (req, res) => {
    try {
        const products = await productRepository.getProducts();
        return products;
    } catch (error) {
        return null;
    }
};

module.exports = renderProductsViewUseCase;
