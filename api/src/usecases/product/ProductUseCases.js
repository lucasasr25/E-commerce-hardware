const productRepository = new (require('../../repositories/productRepository'))();
const productDetailRepository = new (require('../../repositories/productDetailRepository'))();
const stockRepository = new (require('../../repositories/stockRepository'))();
const {Product, ProductDetail, Stock} = require('../../entities/Product');


const createProductUseCase = async ({
    name, description, price,
    manufacturer, warranty_period,
    weight, dimensions, color, material, qtd
}) => {
    const productEntity = new Product({ name, description, price });
    const productDetailEntity = new ProductDetail({
        manufacturer,
        warranty_period,
        weight,
        dimensions,
        color,
        material
    });
    const stockEntity = new Stock(qtd);

    const newProduct = await productRepository.createProduct(
        productEntity.name,
        productEntity.description,
        productEntity.price
    );

    const productDetails = await productDetailRepository.addProductDetails(
        newProduct.id,
        productDetailEntity.manufacturer,
        productDetailEntity.warranty_period,
        productDetailEntity.weight,
        productDetailEntity.dimensions,
        productDetailEntity.color,
        productDetailEntity.material
    );

    await stockRepository.createStock(newProduct.id, stockEntity.quantity);

    return { newProduct, productDetails };
};


const addProductDetailsUseCase = async (product) => {
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
        material
    });

    const productDetail = await productDetailRepository.addProductDetails(
        product_id,
        productDetailEntity.manufacturer,
        productDetailEntity.warranty_period,
        productDetailEntity.weight,
        productDetailEntity.dimensions,
        productDetailEntity.color,
        productDetailEntity.material
    );

    return productDetail;
};


const updateProductDetailsUseCase = async (product) => {
    const {
        id, // ID do produto
        name,
        description,
        price,
        manufacturer,
        warranty_period,
        weight,
        dimensions,
        color,
        material
    } = product;

    if (!id) {
        throw new Error("Product ID is required.");
    }

    // Atualiza a entidade principal
    await productRepository.updateProduct(id, {
        name,
        description,
        price,
    });

    // Atualiza os detalhes
    const productDetailEntity = new ProductDetail({
        manufacturer,
        warranty_period,
        weight,
        dimensions,
        color,
        material
    });

    const updatedDetails = await productDetailRepository.updateProductDetails(
        id, // Aqui continua sendo o product_id
        productDetailEntity.manufacturer,
        productDetailEntity.warranty_period,
        productDetailEntity.weight,
        productDetailEntity.dimensions,
        productDetailEntity.color,
        productDetailEntity.material
    );

    return { success: true, updatedDetails };
};

module.exports = {
  createProductUseCase,
  addProductDetailsUseCase,
  updateProductDetailsUseCase
};
