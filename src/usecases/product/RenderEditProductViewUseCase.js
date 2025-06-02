const productRepository = new (require('../../repositories/productRepository'))();
const productDetailRepository = new (require('../../repositories/productDetailRepository'))();

const renderEditProductViewUseCase = async (id) => {


    if (!id) {
        return null;
    }


    const product = await productRepository.getProductById(id);
    const productDetails = await productDetailRepository.getProductDetails(id);
    return { product, productDetails };

};

module.exports = renderEditProductViewUseCase;
