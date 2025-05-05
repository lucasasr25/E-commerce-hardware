const cartRepository = require("../../repositories/cartRepository");
const productRepository = require("../../repositories/productRepository");

const addItemToCart = async ({ userId, productId, quantity }) => {
    if (!productId || !quantity) {
        throw new Error("Product ID and Quantity are required");
    }

    const product = await productRepository.getProductById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    return await cartRepository.addItemToCart(userId, productId, quantity);
};

const getCartItems = async (cart_id) => {
    if (!cart_id) {
        throw new Error("Cart ID is required");
    }

    return await cartRepository.getCartItems(cart_id);
};

const getCartItemsUser = async (userId) => {
    const items = await cartRepository.getCartItems(userId);
    const total = await cartRepository.getCartTotal(userId);
    return { items, total };
};

const removeItemFromCart = async (userId, product_id) => {
    if (!product_id) {
        throw new Error("Product ID is required");
    }

    const cartItem = await cartRepository.removeItemFromCart(userId, product_id);
    if (!cartItem) {
        throw new Error("Item not found in cart");
    }

    return cartItem;
};

const clearCart = async (cart_id) => {
    if (!cart_id) {
        throw new Error("Cart ID is required");
    }

    return await cartRepository.clearCart(cart_id);
};

const createCart = async (user_id) => {
    if (!user_id) {
        throw new Error("User ID is required");
    }

    return await cartRepository.createCart(user_id);
};

const updateCartItemQuantity = async (userId, items) => {
    if (!items || items.length === 0) {
        throw new Error("Itens do carrinho são obrigatórios");
    }

    for (let item of items) {
        const { productId, quantity } = item;
        if (quantity <= 0) {
            throw new Error(`Quantidade inválida para o produto ${productId}`);
        }
        await cartRepository.updateCartItemQuantity(userId, productId, quantity);
    }

    return { message: "Carrinho atualizado com sucesso!" };
};

const renderCartView = async (userId) => {
    const items = await cartRepository.getCartItems(userId);
    const total = await cartRepository.getCartTotal(userId);
    return { items, total };
};

const checkoutCart = async (cart_id) => {
    if (!cart_id) {
        throw new Error("Cart ID is required");
    }

    return await cartRepository.checkoutCart(cart_id);
};

module.exports = {
    addItemToCart,
    getCartItems,
    getCartItemsUser,
    removeItemFromCart,
    clearCart,
    createCart,
    updateCartItemQuantity,
    renderCartView,
    checkoutCart
};
