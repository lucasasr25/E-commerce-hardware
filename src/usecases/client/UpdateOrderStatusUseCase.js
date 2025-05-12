const orderRepository = require("../../repositories/orderRepository");

const UpdateOrderStatusUseCase = async ({ orderId, statusId }) => {
    if (!orderId || !statusId) {
        throw new Error("Parâmetros obrigatórios ausentes.");
    }

    const updated = await orderRepository.updateOrderStatus(orderId, statusId);
    return updated;
};

module.exports = UpdateOrderStatusUseCase;
