const ProductSupplierRepository = new (require("../../repositories/ProductSupplierRepository"))();

const getAllSuppliers = async () => {
    return await ProductSupplierRepository.findAll();
};

const createSuppliers = async (status_name) => {
};

const deleteSuppliers = async (id) => {
};

module.exports = {
getAllSuppliers
};
