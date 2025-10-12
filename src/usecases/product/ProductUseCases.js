const { Product, ProductDetail, Stock } = require("../../entities/Product");

class ProductUseCases {
  constructor({ productRepository, productDetailRepository, manualStockEntryUseCase }) {
    this.productRepository = productRepository;
    this.productDetailRepository = productDetailRepository;
    this.manualStockEntryUseCase = manualStockEntryUseCase;
  }

  async createProduct({
    name,
    description,
    price,
    supplier_id,
    manufacturer,
    warranty_period,
    weight,
    dimensions,
    color,
    material,
    category_id,
    qtd,
  }) {
    const productEntity = new Product({ name, description, category_id });


    const newProduct = await this.productRepository.create(productEntity.toDTO());
    const productDetailEntity = new ProductDetail({
      product_id: newProduct,
      manufacturer,
      warranty_period,
      weight,
      dimensions,
      color,
      material,
    });
    const productDetails = await this.productDetailRepository.create(productDetailEntity.toDTO());
    const stockEntity = new Stock(qtd, newProduct, price, supplier_id);
    manualStockEntryUseCase(stockEntity.toDTO())
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

    if (!productDetails) {
      return null;
    }

    const finalPrice = productDetails.price * (1 + (productDetails.profit_margin/100));

    return {
      ...productDetails,
      final_price: parseFloat(finalPrice.toFixed(2))  // adiciona campo calculado
    };
  }


  async getProductsUseCase() {
    const products = await this.productRepository.getProducts();

    const updatedProducts = products.map(product => {
      console.log(product.price)
      console.log(product);
      const finalPrice = product.price * (1 + (product.profit_margin/100));
      return {
        ...product,
        final_price: parseFloat(finalPrice.toFixed(2))
      };
    });

    return updatedProducts;
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
      id,
      name,
      description,
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
    });

    const productDetailEntity = new ProductDetail({
      id,
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
