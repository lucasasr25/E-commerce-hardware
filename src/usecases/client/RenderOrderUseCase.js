const orderRepository = require("../../repositories/orderRepository");
const paymentRepository = require("../../repositories/paymentRepository"); // novo
const addressRepository = require("../../repositories/addressRepository"); // se você tiver um
const userRepository = require("../../repositories/clientRepository"); // se necessário

const RenderOrderUseCase = async (orderId) => {
    // 1. Dados básicos do pedido
    const order = await orderRepository.getOrderById(orderId);
    if (!order) throw new Error("Pedido não encontrado");

    // 2. Itens do pedido
    // const orderItems = await orderRepository.getItemsByOrderId(orderId);

    // 3. Dados do status (opcional se já estiver em `order`)
    // const status = await orderRepository.getOrderStatusById(order.status_id);

    // 4. Endereço
    const address = await addressRepository.getAddressById(order.address_id);

    // 5. Cartões usados no pagamento
    const paymentCards = await paymentRepository.getPaymentCardsByOrderId(orderId);

    // 6. Dados do usuário
    // const user = await userRepository.getUserById(order.user_id);

    return {
        ...order,
        // user,
        address,
        // status,
        paymentCards
    };
};

module.exports = RenderOrderUseCase