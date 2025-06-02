const productRepository = new (require("../../repositories/productRepository"))();

const deleteProductUseCase = async (id) => {

    if (!id) {
        return null;
    }

    const product = await productRepository.deleteProduct(id);
    
    return product;

};

module.exports = deleteProductUseCase;
