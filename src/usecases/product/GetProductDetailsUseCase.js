const productDetailRepository = require('../../repositories/productDetailRepository');

const getProductDetailsUseCase = async (product_id) => {
    if (!product_id) {
        return null;
    }
    const productDetails = await productDetailRepository.getProductDetails(product_id);
    return productDetails;
};

module.exports = getProductDetailsUseCase;
