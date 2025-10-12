const ProductRepository = require("../repositories/productRepository");
const ProductDetailRepository = require("../repositories/productDetailRepository");
const StockRepository = require("../repositories/stockRepository");
const ProductUseCasesClass = require("../usecases/product/ProductUseCases");
const StockUseCases = require("../usecases/stock/StockUseCases");

const repositories = {
    productRepository: new ProductRepository("products"),
    productDetailRepository: new ProductDetailRepository("product_details"),
    stockRepository: new StockRepository("stock")
};

const stockUseCases = new StockUseCases({ stockRepository: repositories.stockRepository });


const ProductUseCases = new ProductUseCasesClass({
  productRepository: repositories.productRepository,
  productDetailRepository: repositories.productDetailRepository,
  stockUseCases
});


const mainView = async (req, res) => {
    try {


        const products = await ProductUseCases.getProductsUseCase();

        res.render('index', {
            title: 'Lucas Store',
            products: products
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

module.exports = {
    mainView
}