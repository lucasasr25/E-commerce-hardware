const Cart = require("../../entities/Cart");
const { Product } = require("../../entities/Product");
const cartRepository = new (require("../../repositories/cartRepository"))();
const productRepository = new (require("../../repositories/productRepository"))();

const addItemToCart = async ({ userId, productId, quantity = 1 }) => {
    const dbItems = await cartRepository.getCartItems(userId);
    const productData = await productRepository.getProductById(productId);
    if (!productData) throw new Error("Produto não encontrado.");

    const product = new Product({
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price)
    });

    const cart = new Cart(userId, dbItems);
    for (let i = 0; i < quantity; i++) {
        cart.addItem(product);
    }

    await cartRepository.saveCart(cart);
    return cart.toJSON();
};

const getCartItems = async (cart_id) => {
    if (!cart_id) throw new Error("Cart ID is required");

    const dbItems = await cartRepository.getCartItems(cart_id);
    const cart = new Cart(cart_id, dbItems);
    return cart.toJSON();
};

const getCartItemsUser = async (userId) => {
    const dbItems = await cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    return {
        items: cart.items,
        total: cart.getTotal().toString()
    };
};

const removeItemFromCart = async ({ userId, productId }) => {
    const dbItems = await cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    cart.removeItem(productId);
    await cartRepository.saveCart(cart);
    return cart.toJSON();
};

const clearCart = async ({ userId }) => {
    const cart = new Cart(userId);
    await cartRepository.saveCart(cart);
    return cart.toJSON();
};

const createCart = async (user_id) => {
    if (!user_id) throw new Error("User ID is required");
    return await cartRepository.createCart(user_id);
};

const updateCartItemQuantity = async (userId, products) => {
    const dbItems = await cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    for (const { productId, quantity } of products) {
        cart.updateQuantity(productId, quantity);
    }
    await cartRepository.saveCart(cart);
    return cart.toJSON();
};

const renderCartView = async (userId) => {
    const dbItems = await cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    return {
        items: cart.items,
        total: cart.getTotal().toString()
    };
};

const checkoutCart = async (cart_id) => {
    if (!cart_id) throw new Error("Cart ID is required");
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
