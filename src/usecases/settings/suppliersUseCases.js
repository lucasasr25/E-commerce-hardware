const ProductSupplierRepository = new (require("../../repositories/ProductSupplierRepository"))("product_supplier");
const { Supplier } = require('../../entities/Supplier');

const getAllSuppliers = async () => {
    return await ProductSupplierRepository.getAll();
};

const createProductSupplier = async (supplierData) => {
    const productEntity = new Supplier({
        name: supplierData.name,
        tax_id: supplierData.tax_id,
        phone: supplierData.phone,
        email: supplierData.email,
        address: supplierData.address
    });
    return await ProductSupplierRepository.create(productEntity.toDTO(), 'product_supplier')
};

const deleteProductSupplier = async (id) => {
    return await ProductSupplierRepository.deleteUpdateEntity(id);

};

module.exports = {
getAllSuppliers,
createProductSupplier,
deleteProductSupplier
}; 