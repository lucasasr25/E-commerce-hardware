const ProductSupplierRepository = new (require("../../repositories/ProductSupplierRepository"))("product_supplier");

const getAllSuppliers = async () => {
    return await ProductSupplierRepository.getAll();
};

const createSuppliers = async (status_name) => {
};

const deleteSuppliers = async (id) => {
};

module.exports = {
getAllSuppliers
};
