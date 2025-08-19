const returnRepository = new (require("../../repositories/returnRepository"))();
const orderRepository = new (require("../../repositories/orderRepository"))();


const viewExchanges = async (userId) => {
    const statuses = await orderRepository.getAllOrderStatus();
    if (!userId) {
        throw new Error("ID do usuário não fornecido.");
    }
    const returns = await returnRepository.getReturnsByUserId(userId);
    return {returns, statuses};
};

module.exports = viewExchanges;
