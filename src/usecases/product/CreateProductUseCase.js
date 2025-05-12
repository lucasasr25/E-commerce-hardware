const productRepository = require('../../repositories/productRepository');
const productDetailRepository = require('../../repositories/productDetailRepository');
const stockRepository = require('../../repositories/stockRepository');


const createProductUseCase = async ({
    name, description, price,
    manufacturer, warranty_period,
    weight, dimensions, color, material, qtd
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

    await stockRepository.createStock(newProduct.id, qtd);

    return { newProduct, productDetails };
};

module.exports = createProductUseCase;
