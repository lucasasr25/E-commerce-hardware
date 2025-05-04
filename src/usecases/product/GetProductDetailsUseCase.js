const productDetailRepository = require('../../repositories/productDetailRepository');

const getProductDetailsUseCase = async (req, res) => {
    const { product_id } = req.query;

    if (!product_id) {
        return null;
    }
    const productDetails = await productDetailRepository.getProductDetails(product_id);
    return productDetails;
};

module.exports = getProductDetailsUseCase;
