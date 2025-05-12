const productDetailRepository = require("../../repositories/productDetailRepository");

const deleteProductDetailsUseCase = async (id) => {
    if (!id) {
        return null;
    }
    const productDetail = await productDetailRepository.deleteProductDetails(id);

    return productDetail;

};

module.exports = deleteProductDetailsUseCase;
