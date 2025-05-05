const orderRepository = require("../../repositories/orderRepository");

const getAllOrderStatus = async () => {
    return await orderRepository.getAllOrderStatus();
};

const createOrderStatus = async (status_name) => {
    return await orderRepository.createOrderStatus(status_name);
};

const deleteOrderStatus = async (id) => {
    return await orderRepository.deleteOrderStatus(id);
};

module.exports = {
    getAllOrderStatus,
    createOrderStatus,
    deleteOrderStatus,
};
