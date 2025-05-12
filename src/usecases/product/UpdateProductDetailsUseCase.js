const productDetailRepository = require('../../repositories/productDetailRepository');

const updateProductDetailsUseCase = async (product) => {
    const { id, manufacturer, warranty_period, weight, dimensions, color, material } = product;

    if (!id) {
        return null;
    }

    try {
        const updatedDetails = await productDetailRepository.updateProductDetails(
            id,
            manufacturer,
            warranty_period,
            weight,
            dimensions,
            color,
            material
        );

        if (!updatedDetails) {
            return null;
        }

        return updatedDetails;
    } catch (error) {
        return null;
    }
};

module.exports = updateProductDetailsUseCase;
