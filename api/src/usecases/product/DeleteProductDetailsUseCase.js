const productDetailRepository = require("../../repositories/productDetailRepository");

const deleteProductDetailsUseCase = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return null;
    }


    const productDetail = await productDetailRepository.deleteProductDetails(id);

    return productDetail;

};

module.exports = deleteProductDetailsUseCase;
