const { Supplier } = require('../../entities/Supplier');

class SuppliersUseCases {
  constructor({ productSupplierRepository }) {
    this.productSupplierRepository = productSupplierRepository;
  }

  async getAllSuppliers() {
    return await this.productSupplierRepository.getAll();
  }

  async createProductSupplier(supplierData) {
    const supplierEntity = new Supplier({
      name: supplierData.name,
      tax_id: supplierData.tax_id,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address
    });

    return await this.productSupplierRepository.create(supplierEntity.toDTO(), 'product_supplier');
  }

  async deleteProductSupplier(id) {
    return await this.productSupplierRepository.deleteUpdateEntity(id);
  }
}

module.exports = SuppliersUseCases;
