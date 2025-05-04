const orderRepository = require("../../repositories/orderRepository");


const RenderOrdersUseCase =

async (req,res) => {
    const userId = req.session.user?.id;
    if (!userId) {
        throw new Error("Usuário não autenticado.");
    }

    const orders = await orderRepository.getAllOrders(userId);
    return orders;
}


module.exports = RenderOrdersUseCase;
