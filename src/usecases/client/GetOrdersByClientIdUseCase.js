const orderRepository = require("../../repositories/orderRepository");


const GetOrdersByClientIdUseCase = async (clientId) => {
    const orders = await orderRepository.getOrdersByClientId(clientId);
    const statuses = await orderRepository.getAllOrderStatus();
    return {orders, statuses};
};

module.exports = GetOrdersByClientIdUseCase;
