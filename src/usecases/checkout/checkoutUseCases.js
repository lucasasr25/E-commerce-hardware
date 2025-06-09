const ClientRepository = require('../../repositories/clientRepository');
const CartRepository = require('../../repositories/cartRepository');
const OrderRepository = require('../../repositories/orderRepository');
const CouponRepository = require('../../repositories/couponRepository');
const StockRepository = require('../../repositories/stockRepository');
const CreditCardRepository = require('../../repositories/creditCardRepository');

const { Order } = require('../../entities/Order');

class CheckoutUseCases {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.cartRepository = new CartRepository();
    this.orderRepository = new OrderRepository();
    this.couponRepository = new CouponRepository();
    this.stockRepository = new StockRepository();
    this.creditCardRepository = new CreditCardRepository();
  }

  async getCheckoutData(userId) {
    const cliente = await this.clientRepository.getClientById(userId);
    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const cartoes = await this.creditCardRepository.getCreditCardsByUserId(userId);
    const enderecoFavorito = cliente.addresses?.find(e => e.is_default) || {};
    const telefone = cliente.phone_numbers?.[0] || "";
    const items = await this.cartRepository.getCartItems(userId);
    const total = await this.cartRepository.getCartTotal(userId);

    return {
      nome: cliente.name,
      email: cliente.email,
      apelido: enderecoFavorito.nick,
      endereco: `${enderecoFavorito.street || ''}, ${enderecoFavorito.number || ''}.....`,
      cidade: enderecoFavorito.city || '',
      cep: enderecoFavorito.zipcode || '',
      telefone,
      cartoes,
      enderecos: cliente.addresses || [],
      items,
      total,
    };
  }

  async createOrderFromCart(userId, promotionalCupomCode, pagamentosCartao) {
    if (!userId) throw new Error("Usuário não autenticado");

    const cliente = await this.clientRepository.getClientById(userId);
    if (!cliente) throw new Error("Cliente não encontrado");

    const enderecoFavorito = cliente.addresses?.find(e => e.is_default);
    if (!enderecoFavorito) throw new Error("Endereço padrão não encontrado");

    const items = await this.cartRepository.getCartItems(userId);
    const promotionalCoupon = promotionalCupomCode
      ? await this.couponRepository.getCoupon(promotionalCupomCode)
      : null;

    const order = new Order({
      cliente,
      endereco: enderecoFavorito,
      items,
      promotionalCoupon,
      pagamentosCartao,
    });

    const orderId = await this.orderRepository.createOrderWithCards(
      order.cliente.id,
      null,
      order.getOrderData().couponId,
      order.getOrderData().enderecoId,
      order.getOrderData().status,
      order.subtotal,
      order.total,
      order.getOrderData().items,
      order.getOrderData().cartoes
    );

    for (const item of items) {
      await this.stockRepository.removeStock(item.product_id, item.quantity);
    }

    await this.cartRepository.clearCart(userId);
    return orderId;
  }
}

module.exports = CheckoutUseCases;
