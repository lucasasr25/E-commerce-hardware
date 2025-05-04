const productRepository = require('../../repositories/productRepository');
const productDetailRepository = require('../../repositories/productDetailRepository');

const createProductUseCase = async ({
    name, description, price,
    manufacturer, warranty_period,
    weight, dimensions, color, material
}) => {
    if (!name || !price) {
        throw new Error("Name and price are required");
    }

    const newProduct = await productRepository.createProduct(name, description, price);
    const productDetails = await productDetailRepository.addProductDetails(
        newProduct.id,
        manufacturer,
        warranty_period,
        weight,
        dimensions,
        color,
        material
    );

    return { newProduct, productDetails };
};

module.exports = createProductUseCase;
