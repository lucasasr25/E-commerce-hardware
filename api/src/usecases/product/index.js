const createProductUseCase = require('./CreateProductUseCase');
const getProductsUseCase = require('./GetProductsUseCase');
const getProductDetailsUseCase = require('./GetProductDetailsUseCase');
const addProductDetailsUseCase = require('./AddProductDetailsUseCase');
const updateProductDetailsUseCase = require('./UpdateProductDetailsUseCase');
const deleteProductUseCase = require('./DeleteProductUseCase');
const deleteProductDetailsUseCase = require('./DeleteProductDetailsUseCase');
const renderEdit = require('./RenderEditProductViewUseCase')
const renderDetail = require('./RenderProductDetailViewUseCase')


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
