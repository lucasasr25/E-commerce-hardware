const CartUseCases = new (require('../usecases/cart/CartUseCases.js'))();

const addItemToCart = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { productId, quantity } = req.body;

        if (!userId) return res.status(401).json({ message: "Usuário não autenticado" });

        await CartUseCases.addItemToCart({ userId, productId, quantity });

        res.redirect("/cart/view");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCartItems = async (req, res) => {
    try {
        const { cart_id } = req.query;
        const items = await CartUseCases.getCartItems(cart_id);
        res.json({ items });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCartItemsUser = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { items, total } = await CartUseCases.getCartItemsUser(userId);
        res.render("partials/cartPreview", { items, total });
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { product_id } = req.params;

        await CartUseCases.removeItemFromCart(userId, product_id);

        res.redirect("/cart/view");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const { cart_id } = req.params;
        await CartUseCases.clearCart(cart_id);
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createCart = async (req, res) => {
    try {
        const { user_id } = req.body;
        const cart = await CartUseCases.createCart(user_id);
        res.status(201).json({ message: "Cart created successfully", cart });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { items } = req.body;

        const response = await CartUseCases.updateCartItemQuantity(userId, items);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const renderCartView = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        console.log("estou aqui");
        const { items, total } = await CartUseCases.renderCartView(userId);
        res.render("shopping/cart", { items, total });
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

const checkoutCart = async (req, res) => {
    try {
        const { cart_id } = req.body;
        await CartUseCases.checkoutCart(cart_id);
        res.status(200).json({ message: "Checkout completed successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCartItemsUser,
    addItemToCart,
    getCartItems,
    removeItemFromCart,
    clearCart,
    createCart,
    renderCartView,
    checkoutCart,
    updateCartItemQuantity
};
