const {
  createProductUseCase,
  updateProductDetailsUseCase,
  addProductDetailsUseCase
} = require('./ProductUseCases');

const getProductsUseCase = require('./GetProductsUseCase');
const getProductDetailsUseCase = require('./GetProductDetailsUseCase');
const deleteProductUseCase = require('./DeleteProductUseCase');
const deleteProductDetailsUseCase = require('./DeleteProductDetailsUseCase');
const renderEdit = require('./RenderEditProductViewUseCase');
const renderDetail = require('./RenderProductDetailViewUseCase');

module.exports = {
  createProductUseCase,
  getProductsUseCase,
  getProductDetailsUseCase,
  addProductDetailsUseCase,
  updateProductDetailsUseCase,
  deleteProductUseCase,
  deleteProductDetailsUseCase,
  renderEdit,
  renderDetail
};
