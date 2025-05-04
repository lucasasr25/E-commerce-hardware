const productDetailRepository = require('../../repositories/productDetailRepository');

const addProductDetailsUseCase = async (req, res) => {
    const { product_id, manufacturer, warranty_period, weight, dimensions, color, material } = req.body;

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
