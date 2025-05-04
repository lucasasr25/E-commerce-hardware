const clientRepository = require('../../repositories/clientRepository');
const cartRepository = require("../../repositories/cartRepository");
const orderRepository = require("../../repositories/orderRepository");
const couponRepository = require("../../repositories/couponRepository");

const getCheckoutData = async (userId) => {
    const cliente = await clientRepository.getClientById(userId);
    if (!cliente) {
        throw new Error("Cliente não encontrado");
    }

    const cartoes = await clientRepository.getCreditCardsByUserId(userId);
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

const createOrderFromCart = async (userId, promotionalCupomCode) => {
    if (!userId) throw new Error("Usuário não autenticado");

    const cliente = await clientRepository.getClientById(userId);
    if (!cliente) throw new Error("Cliente não encontrado");

    const enderecoFavorito = cliente.addresses?.find(e => e.is_default);
    if (!enderecoFavorito) throw new Error("Endereço padrão não encontrado");

    const items = await cartRepository.getCartItems(userId);
    const subttotal = await cartRepository.getCartTotal(userId);

    if (!items.length) throw new Error("Carrinho vazio");

    const promotionalCoupon = promotionalCupomCode
        ? await couponRepository.getCoupon(promotionalCupomCode)
        : null;

    let total = subttotal;
    if (promotionalCoupon) {
        const discountPercentage = promotionalCoupon.discount_percentage;
        total -= total * (discountPercentage / 100); // Apply the discount
    }

    await orderRepository.createOrder(
        userId,
        null,
        promotionalCoupon?.id || null,
        enderecoFavorito.id,
        2,
        subttotal,
        total,
        items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }))
    );

    await cartRepository.clearCart(userId);
};

module.exports = {
    getCheckoutData,
    createOrderFromCart
};
