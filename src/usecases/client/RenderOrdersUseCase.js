const orderRepository = new (require("../../repositories/orderRepository"))();

const RenderOrdersUseCase =

async (userId) => {

    if (!userId) {
        throw new Error("Usuário não autenticado.");
    }

    const orders = await orderRepository.getAllOrders(userId);
    return orders;
}


module.exports = RenderOrdersUseCase;
