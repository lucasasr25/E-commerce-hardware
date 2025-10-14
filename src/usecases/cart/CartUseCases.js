const Cart = require("../../entities/Cart");
const { Product } = require("../../entities/Product");

class CartUseCases {
  constructor(cartRepository, productRepository, stockRepository = null) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    if(stockRepository){
      this.stockRepository = stockRepository;
    }
  }

  async addItemToCart({ userId, productId, quantity = 1 }) {
    const dbItems = await this.cartRepository.getCartItems(userId);
    const productData = await this.productRepository.getProductById(productId);

    const productQTD = await this.stockRepository.getProductByID(productId);
    console.log(productQTD);
    if (!productQTD) {
      throw new Error(`Produto com ID ${productId} não encontrado`);
    }

    const quantityDB = Number(productQTD.quantity) || 0;
    if (quantityDB <= 0 || quantityDB < quantity) {
      throw new Error("Sem estoque para o produto");
    }


    if (!productData) {
      throw new Error("Produto não encontrado.");
    }

    const product = new Product({
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
    });

    const cart = new Cart(userId, dbItems);
    for (let i = 0; i < quantity; i++) {
      cart.addItem(product);
    }

    await this.cartRepository.saveCart(cart);
    return cart.toJSON();
  }

  async getCartItems(cart_id) {
    if (!cart_id) throw new Error("Cart ID is required");

    const dbItems = await this.cartRepository.getCartItems(cart_id);
    const cart = new Cart(cart_id, dbItems);
    return cart.toJSON();
  }

  async getCartItemsUser(userId) {
    const dbItems = await this.cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    return {
      items: cart.items,
      total: cart.getTotal().toString(),
    };
  }

  async removeItemFromCart({ userId, productId }) {
    const dbItems = await this.cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    cart.removeItem(productId);
    await this.cartRepository.saveCart(cart);
    return cart.toJSON();
  }

  async clearCart({ userId }) {
    const cart = new Cart(userId);
    await this.cartRepository.saveCart(cart);
    return cart.toJSON();
  }

  async createCart(user_id) {
    if (!user_id) throw new Error("User ID is required");
    return await this.cartRepository.createCart(user_id);
  }

  async updateCartItemQuantity(userId, products) {
    const dbItems = await this.cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    for (const { productId, quantity } of products) {
      const productQTD = await this.stockRepository.getProductByID(productId);
      if (!productQTD) {
        throw new Error(`Produto com ID ${productId} não encontrado`);
      }
      const quantityDB = Number(productQTD.quantity) || 0;
      if ((quantityDB <= 0 && quantity != 0) || quantity > quantityDB) {
        throw new Error("Sem estoque para o produto");
      }

      cart.updateQuantity(productId, quantity);
    }
    await this.cartRepository.saveCart(cart);
    return cart.toJSON();
  }

  async renderCartView(userId) {
    const dbItems = await this.cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);
    return {
      items: cart.items,
      total: cart.getTotal().toString(),
    };
  }

  async checkoutCart(cart_id) {
    if (!cart_id) throw new Error("Cart ID is required");
    return await this.cartRepository.checkoutCart(cart_id);
  }
}

module.exports = CartUseCases;
