const orderRepository = new (require("../../repositories/orderRepository"))();
const paymentRepository = new (require("../../repositories/paymentRepository"))(); 
const addressRepository = new (require("../../repositories/addressRepository"))();
const userRepository = new (require("../../repositories/clientRepository"))();

const RenderOrderUseCase = async (orderId) => {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) throw new Error("Pedido não encontrado");
    const orderItems = await orderRepository.getItemsByOrderId(orderId);
    const address = await addressRepository.getById(order.address_id, "addresses");
    const paymentCards = await paymentRepository.getPaymentCardsByOrderId(orderId);

    return {
        ...order,
        address,
        orderItems,
        paymentCards
    };
};

module.exports = RenderOrderUseCase