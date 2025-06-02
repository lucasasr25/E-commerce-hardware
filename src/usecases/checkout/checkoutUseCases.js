const clientRepository = new (require('../../repositories/clientRepository'))();
const cartRepository = new (require('../../repositories/cartRepository'))();
const orderRepository = new (require('../../repositories/orderRepository'))();
const couponRepository = new (require('../../repositories/couponRepository'))();
const stockRepository = new (require('../../repositories/stockRepository'))();
const creditCardRepository = new (require('../../repositories/creditCardRepository'))();


const {Order} = require('../../entities/Order');



const getCheckoutData = async (userId) => {
    const cliente = await clientRepository.getClientById(userId);
    if (!cliente) {
        throw new Error("Cliente não encontrado");
    }

    const cartoes = await creditCardRepository.getCreditCardsByUserId(userId);
    const enderecoFavorito = cliente.addresses?.find(e => e.is_default) || {};
    const telefone = cliente.phone_numbers?.[0] || "";
    const items = await cartRepository.getCartItems(userId);
    const total = await cartRepository.getCartTotal(userId);

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
        total
    };
};

const createOrderFromCart = async (userId, promotionalCupomCode, pagamentosCartao) => {
    if (!userId) throw new Error("Usuário não autenticado");

    const cliente = await clientRepository.getClientById(userId);
    if (!cliente) throw new Error("Cliente não encontrado");

    const enderecoFavorito = cliente.addresses?.find(e => e.is_default);
    if (!enderecoFavorito) throw new Error("Endereço padrão não encontrado");

    const items = await cartRepository.getCartItems(userId);
    const promotionalCoupon = promotionalCupomCode
        ? await couponRepository.getCoupon(promotionalCupomCode)
        : null;

    // Criação da entidade com validações internas
    const order = new Order({
        cliente,
        endereco: enderecoFavorito,
        items,
        promotionalCoupon,
        pagamentosCartao
    });

    // Persiste no repositório
    const orderId = await orderRepository.createOrderWithCards(
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

    // Baixa no estoque
    for (const item of items) {
        await stockRepository.removeStock(item.product_id, item.quantity);
    }

    await cartRepository.clearCart(userId);
};

module.exports = {
    getCheckoutData,
    createOrderFromCart
};
