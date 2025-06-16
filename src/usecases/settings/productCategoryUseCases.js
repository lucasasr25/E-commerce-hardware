const productRepository = new (require("../../repositories/orderRepository"))('product_category');

const getAllProductCategory = async () => {
    return await productRepository.getAll();
};

const createProductCategory = async (categoryData) => {
    productRepository.create(categoryData);
};

const deleteProductCategory = async (id) => {
    return await productRepository.deleteUpdateEntity(id);

};

module.exports = {
    getAllProductCategory, createProductCategory, deleteProductCategory
};
