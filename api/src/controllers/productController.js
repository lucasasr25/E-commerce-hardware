const ProductUseCases = new (require('../usecases/product/ProductUseCases'))();
const RenderProductUseCases = new (require('../usecases/product/RenderProductUseCases'))();

const createProduct = async (req, res) => {
    try {
        const {
            name, description, price,
            manufacturer, warranty_period,
            weight, dimensions, color, material,
            qtd 
        } = req.body;

        const { newProduct, productDetails } = await ProductUseCases.createProduct({
            name, description, price,
            manufacturer, warranty_period,
            weight, dimensions, color, material,
            qtd 
        });

        res.status(201).json({
            message: "Product and details created successfully",
            product: newProduct,
            productDetails: productDetails
        });
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
        res.redirect("/product/view"); 
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
        const result = await ProductUseCases.deleteProduct(id);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
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

const renderCreateProductView = (req, res) => {
    res.render("products/createProduct");
};

const renderEditProductView = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const { product, productDetails } = await RenderProductUseCases.renderEditProductViewUseCase(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        res.render("products/editProduct", { product, productDetails});
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
