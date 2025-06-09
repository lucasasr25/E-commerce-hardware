const ProductRepository = require('../../repositories/productRepository');
const ProductDetailRepository = require('../../repositories/productDetailRepository');
const StockRepository = require('../../repositories/stockRepository');
const { Product, ProductDetail, Stock } = require('../../entities/Product');

class ProductUseCases {
  constructor() {
    this.productRepository = new ProductRepository();
    this.productDetailRepository = new ProductDetailRepository();
    this.stockRepository = new StockRepository();
  }

  async createProduct({
    name,
    description,
    price,
    manufacturer,
    warranty_period,
    weight,
    dimensions,
    color,
    material,
    qtd,
  }) {
    const productEntity = new Product({ name, description, price });
    const productDetailEntity = new ProductDetail({
      manufacturer,
      warranty_period,
      weight,
      dimensions,
      color,
      material,
    });
    const stockEntity = new Stock(qtd);

    const newProduct = await this.productRepository.createProduct(
      productEntity.name,
      productEntity.description,
      productEntity.price
    );

    const productDetails = await this.productDetailRepository.addProductDetails(
      newProduct.id,
      productDetailEntity.manufacturer,
      productDetailEntity.warranty_period,
      productDetailEntity.weight,
      productDetailEntity.dimensions,
      productDetailEntity.color,
      productDetailEntity.material
    );

    await this.stockRepository.createStock(newProduct.id, stockEntity.quantity);

    return { newProduct, productDetails };
  }

  async addProductDetails(product) {
    const { product_id, manufacturer, warranty_period, weight, dimensions, color, material } = product;

    if (!product_id) {
      throw new Error("Product ID is required.");
    }

    const productDetailEntity = new ProductDetail({
      manufacturer,
      warranty_period,
      weight,
      dimensions,
      color,
      material,
    });

    const productDetail = await this.productDetailRepository.addProductDetails(
      product_id,
      productDetailEntity.manufacturer,
      productDetailEntity.warranty_period,
      productDetailEntity.weight,
      productDetailEntity.dimensions,
      productDetailEntity.color,
      productDetailEntity.material
    );

    return productDetail;
  }

async deleteProductDetailsUseCase(id) {
    if (!id) {
      return null;
    }
    const productDetail = await this.productDetailRepository.deleteProductDetails(id);
    return productDetail;
  }

  async getProductDetailsUseCase(product_id) {
    if (!product_id) {
      return null;
    }
    const productDetails = await this.productDetailRepository.getProductDetails(product_id);
    return productDetails;
  }

  async getProductsUseCase() {
    const products = await this.productRepository.getProducts();
    return products;
  }

  async deleteProductUseCase(id) {
    if (!id) {
      return null;
    }
    const product = await this.productRepository.deleteProduct(id);
    return product;
  }

  async updateProductDetails(product) {
    const {
      id, // product_id
      name,
      description,
      price,
      manufacturer,
      warranty_period,
      weight,
      dimensions,
      color,
      material,
    } = product;

    if (!id) {
      throw new Error("Product ID is required.");
    }

    await this.productRepository.updateProduct(id, {
      name,
      description,
      price,
    });

    const productDetailEntity = new ProductDetail({
      manufacturer,
      warranty_period,
      weight,
      dimensions,
      color,
      material,
    });

    const updatedDetails = await this.productDetailRepository.updateProductDetails(
      id,
      productDetailEntity.manufacturer,
      productDetailEntity.warranty_period,
      productDetailEntity.weight,
      productDetailEntity.dimensions,
      productDetailEntity.color,
      productDetailEntity.material
    );

    return { success: true, updatedDetails };
  }
}

module.exports = ProductUseCases;
