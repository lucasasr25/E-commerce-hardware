const ProductUseCases = new (require('../usecases/product/ProductUseCases'))();

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