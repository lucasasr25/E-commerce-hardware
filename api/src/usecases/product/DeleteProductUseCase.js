const productRepository = require("../../repositories/productRepository");

const deleteProductUseCase = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return null;
    }

    const product = await productRepository.deleteProduct(id);
    
    return product;

};

module.exports = deleteProductUseCase;
