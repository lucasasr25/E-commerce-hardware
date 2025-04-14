const productRepository = require("../repositories/productRepository");
const productDetailRepository = require("../repositories/productDetailRepository");

// Função para criar um produto
const createProduct = async (req, res) => {
    // Destructure the fields from the request body
    const { name, description, price, manufacturer, warranty_period, weight, dimensions, color, material } = req.body;

    // Check if the essential fields (name and price) are present
    if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
    }

    try {
        // Step 1: Create the product (without details yet)
        const newProduct = await productRepository.createProduct(name, description, price);

        // Step 2: Add the product details after the product is created
        const newProductDetail = await productDetailRepository.addProductDetails(
            newProduct.id, // Pass the newly created product's id
            manufacturer,
            warranty_period,
            weight,
            dimensions,
            color,
            material
        );

        // Return a success response including the created product and details
        res.status(201).json({
            message: "Product and details created successfully",
            product: newProduct,
            productDetails: newProductDetail
        });
    } catch (error) {
        // If any error occurs, log it and send an error response
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para listar todos os produtos
const getProducts = async (req, res) => {
    try {
        const products = await productRepository.getProducts();
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para obter detalhes de um produto
const getProductDetails = async (req, res) => {
    const { product_id } = req.query;

    if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const productDetails = await productDetailRepository.getProductDetails(product_id);
        res.json({ productDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para adicionar detalhes ao produto
const addProductDetails = async (req, res) => {
    const { product_id, manufacturer, warranty_period, weight, dimensions, color, material } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        // Adicionar detalhes ao produto
        const productDetail = await productDetailRepository.addProductDetails(
            product_id,
            manufacturer,
            warranty_period,
            weight,
            dimensions,
            color,
            material
        );
        res.status(201).json({ message: "Product details added successfully", productDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para atualizar os detalhes de um produto
const updateProductDetails = async (req, res) => {
    const { id, manufacturer, warranty_period, weight, dimensions, color, material } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Product Detail ID is required" });
    }

    try {
        const updatedDetails = await productDetailRepository.updateProductDetails(
            id,
            manufacturer,
            warranty_period,
            weight,
            dimensions,
            color,
            material
        );

        if (!updatedDetails) {
            return res.status(404).json({ message: "Product details not found" });
        }

        res.status(200).json({ message: "Product details updated successfully", updatedDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para remover um produto
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const product = await productRepository.deleteProduct(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para remover detalhes de um produto
const deleteProductDetails = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Product Detail ID is required" });
    }

    try {
        const productDetail = await productDetailRepository.deleteProductDetails(id);

        if (!productDetail) {
            return res.status(404).json({ message: "Product detail not found" });
        }

        res.status(200).json({ message: "Product detail deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para renderizar a página de produtos
const renderProductsView = async (req, res) => {
    try {
        const products = await productRepository.getProducts();
        res.render("products/productList", { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching products.");
    }
};

// Função para renderizar a página de detalhes de um produto
const renderProductDetailView = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const product = await productRepository.getProductById(1);
        const productDetails = await productDetailRepository.getProductDetails(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.render("products/productDetail", { product, productDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching product details.");
    }
};

// Função para renderizar a página de criação de produto
const renderCreateProductView = async (req, res) => {
    res.render("products/createProduct");
};

// Função para renderizar a página de edição de produto
const renderEditProductView = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const product = await productRepository.getProductById(id);
        const productDetails = await productDetailRepository.getProductDetails(id);

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
