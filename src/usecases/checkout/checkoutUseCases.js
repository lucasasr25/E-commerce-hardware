const clientRepository = require('../../repositories/clientRepository');
const cartRepository = require("../../repositories/cartRepository");
const orderRepository = require("../../repositories/orderRepository");
const couponRepository = require("../../repositories/couponRepository");
const stockRepository = require("../../repositories/stockRepository"); // Importa o repositório de estoque


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

const createOrderFromCart = async (userId, promotionalCupomCode, pagamentos_cartao) => {
    if (!userId) throw new Error("Usuário não autenticado");

    const cliente = await clientRepository.getClientById(userId);
    if (!cliente) throw new Error("Cliente não encontrado");

    const enderecoFavorito = cliente.addresses?.find(e => e.is_default);
    if (!enderecoFavorito) throw new Error("Endereço padrão não encontrado");

    const items = await cartRepository.getCartItems(userId);
    if (!items.length) throw new Error("Carrinho vazio");

    const subtotal = Number(await cartRepository.getCartTotal(userId));

    // Cálculo do cupom (se existir)
    const promotionalCoupon = promotionalCupomCode
        ? await couponRepository.getCoupon(promotionalCupomCode)
        : null;

    let valorCupom = 0;
    let total = subtotal;

    if (promotionalCoupon) {
        const discountPercentage = promotionalCoupon.discount_percentage;
        valorCupom = total * (discountPercentage / 100);
        total -= valorCupom;
    }

    const formattedCartoes = Object.values(pagamentos_cartao || {}).map(c => ({
        id: parseInt(c.id),
        valor: parseFloat(c.valor)
    }));

    
    //adiciona frete
    total += 50;

    
    // Soma dos cartões
    const totalCartoes = formattedCartoes.reduce((acc, curr) => acc + curr.valor, 0);

    // Validação: soma dos cartões + cupons deve ser igual ao total da compra original
    const somaFinal = totalCartoes;
    if (Math.abs(somaFinal - total) > 0.01) {
        throw new Error(`A soma dos cartões (${totalCartoes.toFixed(2)}) e do cupom (${valorCupom.toFixed(2)}) deve ser igual ao total da compra (${total.toFixed(2)}).`);
    }

    // Validação dos valores dos cartões
    for (const [index, c] of formattedCartoes.entries()) {
        if (isNaN(c.valor)) {
            throw new Error(`Valor inválido no cartão ${index + 1}.`);
        }
        if (c.valor < 10 && valorCupom <= 0) {
            throw new Error(`O valor do cartão ${index + 1} deve ser no mínimo R$ 10,00 ou parte do pagamento deve ser com cupom.`);
        }
    }

    // Criação do pedido
    const orderId = await orderRepository.createOrderWithCards(
        userId,
        null,
        promotionalCoupon?.id || null,
        enderecoFavorito.id,
        2,
        subtotal,
        total,
        items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        })),
        formattedCartoes
    );

    for (const item of items) {
        try {
            await stockRepository.removeStock(item.product_id, item.quantity);
        } catch (error) {
            // Lidar com o erro de estoque insuficiente ou outro erro relacionado
            console.error(`Erro ao dar baixa no estoque do produto ${item.product_id}: ${error.message}`);
            throw new Error(`Erro ao dar baixa no estoque do produto ${item.product_id}`);
        }
    }

    await cartRepository.clearCart(userId);
};



module.exports = {
    getCheckoutData,
    createOrderFromCart
};
