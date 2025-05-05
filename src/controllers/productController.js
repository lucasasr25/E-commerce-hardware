const productUseCase = require('../usecases/product');


const createProduct = async (req, res) => {
    try {
        const { product, productDetails } = await productUseCase.createProductUseCase(req, res);
        res.status(201).json({
            message: "Product and details created successfully",
            product: product,
            productDetails: productDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await productUseCase.getProductsUseCase(req, res);
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getProductDetails = async (req, res) => {
    try {
        const productDetails = await productUseCase.getProductDetailsUseCase(req, res);
        res.json({ productDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const addProductDetails = async (req, res) => {
    try {
        const productDetail = await productUseCase.addProductDetailsUseCase(req, res);
        res.status(201).json({ message: "Product details added successfully", productDetail });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const updateProductDetails = async (req, res) => {
    try {
        const updatedDetails = await productUseCase.updateProductDetailsUseCase(req, res);
        res.status(200).json({ message: "Product details updated successfully", updatedDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const result = await productUseCase.deleteProduct(req, res);

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
        const result = await productUseCase.deleteProductDetails(req, res);

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
        const products = await productUseCase.getProducts();
        res.render("products/productList", { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching products.");
    }
};

const renderProductDetailView = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const { product, productDetails } = await productUseCase.renderDetail(req, res);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log({ product, productDetails })
        res.render("products/productDetail", { product, productDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching product details.");
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
        const { product, productDetails } = await productUseCase.renderEdit(req, res);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.render("editProduct", { product, productDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching product data for editing.");
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
