const productDetailRepository = require('../../repositories/productDetailRepository');

const updateProductDetailsUseCase = async (req, res) => {
    const { id, manufacturer, warranty_period, weight, dimensions, color, material } = req.body;

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
