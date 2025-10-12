class ProductCategoryUseCases {
  constructor({ productCategoryRepository }) {
    this.productCategoryRepository = productCategoryRepository;
  }

  async getAllProductCategory() {
    return await this.productCategoryRepository.getAll();
  }

  async createProductCategory(categoryData) {
    return await this.productCategoryRepository.create(categoryData);
  }

  async deleteProductCategory(id) {
    return await this.productCategoryRepository.deleteUpdateEntity(id);
  }
}

module.exports = ProductCategoryUseCases;
