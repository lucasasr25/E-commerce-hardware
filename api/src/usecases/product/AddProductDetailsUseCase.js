const productDetailRepository = require('../../repositories/productDetailRepository');

const addProductDetailsUseCase = async (product) => {
    const { product_id, manufacturer, warranty_period, weight, dimensions, color, material } = product;

    if (!product_id) {
        return null;
    }

    const productDetail = await productDetailRepository.addProductDetails(
        product_id,
        manufacturer,
        warranty_period,
        weight,
        dimensions,
        color,
        material
    );

    return productDetail;
};

module.exports = addProductDetailsUseCase;
