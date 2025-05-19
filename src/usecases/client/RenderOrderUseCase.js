const orderRepository = require("../../repositories/orderRepository");
const paymentRepository = require("../../repositories/paymentRepository"); // novo
const addressRepository = require("../../repositories/addressRepository"); // se você tiver um
const userRepository = require("../../repositories/clientRepository"); // se necessário

const RenderOrderUseCase = async (orderId) => {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) throw new Error("Pedido não encontrado");
    const orderItems = await orderRepository.getItemsByOrderId(orderId);
    const address = await addressRepository.getAddressById(order.address_id);
    const paymentCards = await paymentRepository.getPaymentCardsByOrderId(orderId);

    return {
        ...order,
        address,
        orderItems,
        paymentCards
    };
};

module.exports = RenderOrderUseCase