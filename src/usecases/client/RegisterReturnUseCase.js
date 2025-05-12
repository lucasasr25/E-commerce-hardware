const returnRepository = require("../../repositories/returnRepository");
const orderRepository = require("../../repositories/orderRepository");
const orderStatusRepository = require("../../repositories/orderStatusRepository");

const RegisterReturnUseCase = async (data) => {
    const { user_id, order_id, product_ids } = data;

    // Verifica status do pedido
    const order = await orderRepository.getOrderById(order_id);
    if (!order) {
        throw new Error("Pedido não encontrado.");
    }

    const approvedID = await orderStatusRepository.getStatusID("APROVADO");
    if (!approvedID) {
        throw new Error("Status de troca não encontrado.");
    }


    if (order.status_id !== approvedID.id) {
        throw new Error("Não é possível solicitar troca para este pedido. Status inválido.");
    }

    const results = [];

    for (const product_id of product_ids) {
        const result = await returnRepository.createReturn({
            user_id,
            order_id,
            product_id,
            quantity: 1 // ajuste conforme necessidade
        });
        results.push(result);
    }

    // Obtém o status "TROCA SOLICITADA"
    const orderStatus = await orderStatusRepository.getStatusID("TROCA SOLICITADA");
    if (!orderStatus) {
        throw new Error("Status de troca não encontrado.");
    }

    // Atualiza o status do pedido para "TROCA SOLICITADA"
    await orderRepository.updateOrderStatus(order_id, orderStatus.id);

    return results;
};

module.exports = RegisterReturnUseCase;
