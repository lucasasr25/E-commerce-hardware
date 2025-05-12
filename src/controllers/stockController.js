const manualStockEntryUseCase = require("../usecases/stock/manualStockEntryUseCase");
const decreaseStockOnSaleUseCase = require("../usecases/stock/decreaseStockOnSaleUseCase");
const reenterStockOnReturnUseCase = require("../usecases/stock/reenterStockOnReturnUseCase");
const showEntryFormUseCase = require("../usecases/stock/getProductsForStockEntryUseCase");
const productUseCase = require('../usecases/product');

// GET – Renderiza a view da entrada
const showEntryForm = async (req, res) => {
    try {
        const products = await showEntryFormUseCase();  // Obtém os produtos com a quantidade de estoque
        const success = req.query.success;  // Variável de sucesso para mostrar a mensagem
        res.render("settings/entryForm", { products, success });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar formulário de entrada.");
    }
};


// POST – Faz a entrada de estoque
const manualEntry = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        await manualStockEntryUseCase({ product_id, quantity });
        res.redirect("/settings/entry?success=1");
    } catch (error) {
        res.status(400).send("Erro ao realizar entrada no estoque.");
    }
};

// RF0053 – Baixa por venda
const decreaseStock = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const result = await decreaseStockOnSaleUseCase({ product_id, quantity });
        res.status(200).json({ message: "Baixa de estoque realizada", data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// RF0054 – Reentrada por troca
const reenterStock = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const result = await reenterStockOnReturnUseCase({ product_id, quantity });
        res.status(200).json({ message: "Reentrada em estoque realizada", data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    showEntryForm,
    manualEntry,
    decreaseStock,
    reenterStock
};
