const ProductRepository = require("../repositories/productRepository");
const ProductDetailRepository = require("../repositories/productDetailRepository");
const StockRepository = require("../repositories/stockRepository");

const ProductUseCasesClass = require("../usecases/product/ProductUseCases");
const RenderProductUseCasesClass = require("../usecases/product/RenderProductUseCases");
const StockUseCases = require("../usecases/stock/StockUseCases");

const suppliersUseCases = require("../usecases/settings/suppliersUseCases");
const productCategoryUseCases = require("../usecases/settings/productCategoryUseCases");

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

const RenderProductUseCases = new RenderProductUseCasesClass({
  productRepository: repositories.productRepository,
  productDetailRepository: repositories.productDetailRepository,
});

const createProduct = async (req, res) => {
    try {
        const {
            name, description, price,
            manufacturer, warranty_period,
            weight, dimensions, color, material,
            qtd, category_id, supplier_id 
        } = req.body;

        const { newProduct, productDetails } = await ProductUseCases.createProduct({
            name, description, price,
            manufacturer, warranty_period,
            weight, dimensions, color, material,
            qtd, category_id, supplier_id
        });

        res.redirect("/product/view?forceReload=true"); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const getProducts = async (req, res) => {
    try {
        const products = await ProductUseCases.getProductsUseCase();
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getProductDetails = async (req, res) => {
    try {
        const { product_id } = req.query;
        const productDetails = await ProductUseCases.getProductDetailsUseCase(product_id);
        res.json({ productDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const addProductDetails = async (req, res) => {
    try {
        const productData = req.body;
        const productDetail = await ProductUseCases.addProductDetails(productData);
        res.status(201).json({ message: "Product details added successfully", productDetail });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const updateProductDetails = async (req, res) => {
    try {
        const productData = req.body;
        await ProductUseCases.updateProductDetails(productData);

        // Redireciona para a listagem ou visualização do produto
        res.redirect("/product/view?forceReload=true"); 
    } catch (error) {
        console.error(error);

        // Em caso de erro, renderiza uma tela amigável
        res.status(500).render('status/error', {
            message: error.message || "Erro ao atualizar o produto."
        });
    }
};


const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const result = await ProductUseCases.deleteProductUseCase(id);

        res.redirect("/product/view"); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteProductDetails = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Product Detail ID is required" });
    }

    try {
        const result = await ProductUseCases.deleteProductDetailsUseCase(id);

        if (!result) {
            return res.status(404).json({ message: "Product detail not found" });
        }

        res.status(200).json({ message: "Product detail deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const renderProductsView = async (req, res) => {
    try {
        const products = await ProductUseCases.getProductsUseCase();
        res.render("products/productList", { products });
    } catch (error) {
        console.error(error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

const renderProductDetailView = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const { product, productDetails } = await RenderProductUseCases.renderProductDetailViewUseCase(id);
        console.log(product)
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.render("products/productDetail", { product, productDetails });
    } catch (error) {
        console.error(error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

const renderCreateProductView = async (req, res) => {
    try {
        const supplierList = await suppliersUseCases.getAllSuppliers() || [];
        const productCategoryList = await productCategoryUseCases.getAllProductCategory() || [];

        res.render("products/createProduct", { supplierList, productCategoryList});
    } catch (error) {
        console.error("Erro ao carregar fornecedores:", error);
        res.status(500).render("status/error", {
            message: "Erro ao carregar fornecedores."
        });
    }
};

const renderEditProductView = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const { product, productDetails } = await RenderProductUseCases.renderEditProductViewUseCase(id);
        const supplierList = await suppliersUseCases.getAllSuppliers() || [];
        const productCategoryList = await productCategoryUseCases.getAllProductCategory() || [];

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        res.render("products/editProduct", { product, productDetails, supplierList, productCategoryList});
    } catch (error) {
        console.error(error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductDetails,
    addProductDetails,
    updateProductDetails,
    deleteProduct,
    deleteProductDetails,
    renderProductsView,
    renderProductDetailView,
    renderCreateProductView,
    renderEditProductView
};
