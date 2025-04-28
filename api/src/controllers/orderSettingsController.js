const orderRepository = require("../repositories/orderRepository");


const changeOrder = async (req, res) => {
    try {
        const orderStatusList = await orderRepository.getAllOrderStatus();
        res.render("settings/orderStatus", { orderStatusList });
    } catch (error) {
        console.error("Erro ao carregar configurações de pedido:", error);
        res.status(500).send("Erro interno ao carregar configurações");
    }
};

const createOrderStatus = async (req, res) => {
    try {
        const { status_name } = req.body;
        await orderRepository.createOrderStatus(status_name);
        res.redirect("/settings/order-status");
    } catch (error) {
        console.error("Erro ao criar status:", error);
        res.status(500).send("Erro ao criar status");
    }
};

const deleteOrderStatus = async (req, res) => {
    try {
        const { id } = req.body;
        await orderRepository.deleteOrderStatus(id);
        res.redirect("/settings/order-status");
    } catch (error) {
        console.error("Erro ao deletar status:", error);
        res.status(500).send("Erro ao deletar status");
    }
};

module.exports = {
    changeOrder,
    createOrderStatus,
    deleteOrderStatus,
};
