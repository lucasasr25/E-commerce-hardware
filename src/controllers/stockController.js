const StockUseCasesClass = require("../usecases/stock/StockUseCases");
const StockRepository = require("../repositories/stockRepository");
const suppliersUseCases = require('../usecases/settings/suppliersUseCases');

// Cria a instância do repositório
const stockRepository = new StockRepository("stock");

// Injeta no StockUseCases de forma consistente
const stockUseCases = new StockUseCasesClass({ stockRepository });

// GET – Renderiza a view da entrada
const showEntryForm = async (req, res) => {
    try {
        const supplierList = await suppliersUseCases.getAllSuppliers() || [];
        const products = await stockUseCases.getProductsForStockEntry();  // Obtém os produtos com a quantidade de estoque
        const stockEntries = await stockUseCases.getAllStocks();  // Obtém todos os registros de entrada de estoque
        const success = req.query.success;  // Variável de sucesso para mostrar a mensagem
        res.render("settings/entryForm", { products, success, supplierList, stockEntries });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar formulário de entrada.");
    }
};

// POST – Faz a entrada de estoque
const manualEntry = async (req, res) => {
    try {
        const { product_id, quantity, price, product_supplier_id } = req.body;
        const data = {
            product_id,
            quantity,
            price,
            product_supplier_id,
            date: new Date(),
        };
        await stockUseCases.manualStockEntry(product_id, quantity, price, product_supplier_id);  // Usando o método da classe StockUseCases
        res.redirect("/settings/entry?success=1");
    } catch (error) {
        console.error(error);
        res.status(400).send("Erro ao realizar entrada no estoque.");
    }
};

// RF0053 – Baixa por venda
const decreaseStock = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const result = await stockUseCases.decreaseStockOnSale({ product_id, quantity });  // Usando o método da classe StockUseCases
        res.status(200).json({ message: "Baixa de estoque realizada", data: result });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// RF0054 – Reentrada por troca
const reenterStock = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const result = await stockUseCases.reenterStockOnReturn({ product_id, quantity });  // Usando o método da classe StockUseCases
        res.status(200).json({ message: "Reentrada em estoque realizada", data: result });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    showEntryForm,
    manualEntry,
    decreaseStock,
    reenterStock
};
