const productRepository = require("../repositories/productRepository");

const mainView = async (req, res) => {
    try {
        const products = await productRepository.getProducts();

        res.render('index', {
            title: 'Lucas Store',
            products: products
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

module.exports = {
    mainView
}