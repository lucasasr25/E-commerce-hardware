const ProductRepository = require('../../repositories/productRepository');
const ProductDetailRepository = require('../../repositories/productDetailRepository');

class RenderProductUseCases {
  constructor() {
    this.productRepository = new ProductRepository();
    this.productDetailRepository = new ProductDetailRepository();
  }

  async renderEditProductViewUseCase(id) {
    if (!id) {
      return null;
    }

    const product = await this.productRepository.getProductById(id);
    const productDetails = await this.productDetailRepository.getProductDetails(id);
    console.log(productDetails)
    return { product, productDetails };
  }

  async renderProductDetailViewUseCase(id) {
    if (!id) {
      return null;
    }

    const product = await this.productRepository.getProductById(id);
    const productDetails = await this.productDetailRepository.getProductDetails(id);
    if (!productDetails) {
      return { product, productDetails: null };
    }

    const finalPrice = product.price * (1 + (product.profit_margin/100));

    return {
      product:{
        ...product,
        final_price: parseFloat(finalPrice.toFixed(2))
      },
      productDetails
    };
  }

  async renderProductsViewUseCase(req, res) {
    try {
      const products = await this.productRepository.getProducts();
      return products;
    } catch (error) {
      return null;
    }
  }
}

module.exports = RenderProductUseCases;
