const cartRepository = require("../repositories/cartRepository");
const productRepository = require("../repositories/productRepository");

// Função para adicionar um item ao carrinho
const addItemToCart = async (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    if (!cart_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Cart ID, Product ID and Quantity are required" });
    }

    try {
        // Verificar se o produto existe
        const product = await productRepository.getProductById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Adicionar item ao carrinho
        const cartItem = await cartRepository.addItemToCart(cart_id, product_id, quantity);

        res.status(201).json({ message: "Item added to cart successfully", cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para listar os itens de um carrinho
const getCartItems = async (req, res) => {
    const { cart_id } = req.query;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        // Buscar itens do carrinho
        const items = await cartRepository.getCartItems(cart_id);
        res.json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para remover um item do carrinho
const removeItemFromCart = async (req, res) => {
    const { cart_id, product_id } = req.params;

    if (!cart_id || !product_id) {
        return res.status(400).json({ message: "Cart ID and Product ID are required" });
    }

    try {
        const cartItem = await cartRepository.removeItemFromCart(cart_id, product_id);

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para limpar o carrinho
const clearCart = async (req, res) => {
    const { cart_id } = req.params;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        await cartRepository.clearCart(cart_id);
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para criar um carrinho de compras
const createCart = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const cart = await cartRepository.createCart(user_id);
        res.status(201).json({ message: "Cart created successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Função para renderizar a página do carrinho
const renderCartView = async (req, res) => {
    const { cart_id } = req.query;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        const items = await cartRepository.getCartItems(cart_id);
        res.render("cart", { items });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving cart items.");
    }
};

// Função para renderizar a página de checkout do carrinho
const renderCheckoutView = async (req, res) => {
    const { cart_id } = req.query;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        const items = await cartRepository.getCartItems(cart_id);
        // Lógica adicional para checkout
        res.render("checkout", { items });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving checkout information.");
    }
};

// Função para finalizar a compra
const checkoutCart = async (req, res) => {
    const { cart_id } = req.body;

    if (!cart_id) {
        return res.status(400).json({ message: "Cart ID is required" });
    }

    try {
        // Processar pagamento e criar pedido
        await cartRepository.checkoutCart(cart_id);
        res.status(200).json({ message: "Checkout completed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addItemToCart,
    getCartItems,
    removeItemFromCart,
    clearCart,
    createCart,
    renderCartView,
    renderCheckoutView,
    checkoutCart
};
