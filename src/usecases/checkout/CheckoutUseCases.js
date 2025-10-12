const Cart = require("../../entities/Cart");
const { Order } = require('../../entities/Order');

class CheckoutUseCases {
  constructor({
    stockUseCases,
    clientRepository,
    cartRepository,
    orderRepository,
    couponRepository,
    stockRepository,
    creditCardRepository
  }) {
    this.stockUseCases = stockUseCases;
    this.clientRepository = clientRepository;
    this.cartRepository = cartRepository;
    this.orderRepository = orderRepository;
    this.couponRepository = couponRepository;
    this.stockRepository = stockRepository;
    this.creditCardRepository = creditCardRepository;
  }

  async getCheckoutData(userId) {
    const cliente = await this.clientRepository.getClientById(userId);
    if (!cliente) throw new Error("Cliente não encontrado");

    const cartoes = await this.creditCardRepository.getCreditCardsByUserId(userId);
    const enderecoFavorito = cliente.addresses?.find(e => e.is_default) || {};
    const telefone = cliente.phone_numbers?.[0] || "";

    const dbItems = await this.cartRepository.getCartItems(userId);
    const cart = new Cart(userId, dbItems);

    const order = new Order({
      cliente,
      endereco: enderecoFavorito,
      items: cart.items
    });

    return {
      nome: cliente.name,
      email: cliente.email,
      apelido: enderecoFavorito.nick,
      endereco: `${enderecoFavorito.street || ''}, ${enderecoFavorito.number || ''} - ${enderecoFavorito.city || ''}`,
      cidade: enderecoFavorito.city || '',
      cep: enderecoFavorito.zipcode || '',
      telefone,
      cartoes,
      enderecos: cliente.addresses || [],
      items: cart.items,
      total: cart.getTotal().toString(),
    };
  }

  async createOrderFromCart(userId, promotionalCupomCode, tradeCouponCodes = [], pagamentosCartao) {
    if (!userId) throw new Error("Usuário não autenticado");

    const cliente = await this.clientRepository.getClientById(userId);
    if (!cliente) throw new Error("Cliente não encontrado");

    const enderecoFavorito = cliente.addresses?.find(e => e.is_default);
    if (!enderecoFavorito) throw new Error("Endereço padrão não encontrado");

    const items = await this.cartRepository.getCartItems(userId);

    await this.stockUseCases.decreaseStockOnSale(items);

    const promotionalCoupon = promotionalCupomCode
        ? await this.couponRepository.getCoupon(promotionalCupomCode)
        : null;

    if (promotionalCupomCode && promotionalCupomCode.length > 0 && !promotionalCoupon) {
        throw new Error("Cupom não encontrado: " + promotionalCupomCode);
    }

    const tradeCoupons = [];
    const invalidCoupons = [];
    const seenCodes = new Set();

    for (const code of tradeCouponCodes) {
        if (seenCodes.has(code)) {
            throw new Error("Cupom Duplicado " + code);
        }
        seenCodes.add(code);

        try {
            const couponData = await this.couponRepository.getTradeCoupon(code);
            if (!couponData && code.length > 0) {
                throw new Error("Cupom não encontrado " + code);
            } else if (couponData.used) {
                throw new Error('Cupom já utilizado ' + code);
            } else if (!couponData.value) {
                throw new Error('Cupom sem valor ' + code);
            }

            tradeCoupons.push({
                code: couponData.code,
                value: parseFloat(couponData.value)
            });
        } catch (error) {
            invalidCoupons.push({ code, message: 'Erro ao validar cupom' });
        }
    }

    const order = new Order({
        cliente,
        endereco: enderecoFavorito,
        items,
        promotionalCoupon,
        tradeCoupons,
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

    await this.cartRepository.clearCart(userId);
    return { orderId, invalidCoupons };
  }
}

module.exports = CheckoutUseCases;
