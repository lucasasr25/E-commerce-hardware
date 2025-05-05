const productRepository = require("../../repositories/productRepository");
const productDetailRepository = require("../../repositories/productDetailRepository");

const renderEditProductViewUseCase = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return null;
    }


    const product = await productRepository.getProductById(id);
    const productDetails = await productDetailRepository.getProductDetails(id);
    return { product, productDetails };

};

module.exports = renderEditProductViewUseCase;
