const orderStatusUseCases = require("../usecases/settings/orderStatusUseCases");
const paymentStatusUseCases = require("../usecases/settings/paymentStatusUseCases");


const changeOrder = async (req, res) => {
    try {
        const orderStatusList = await orderStatusUseCases.getAllOrderStatus();
        res.render("settings/orderStatus", { orderStatusList });
    } catch (error) {
        console.error("Erro ao carregar configurações de pedido:", error);
        res.status(500).send("Erro interno ao carregar configurações");
    }
};

const createOrderStatus = async (req, res) => {
    try {
        const { status_name } = req.body;
        await orderStatusUseCases.createOrderStatus(status_name);
        res.redirect("/settings/order-status");
    } catch (error) {
        console.error("Erro ao criar status:", error);
        res.status(500).send("Erro ao criar status");
    }
};

const deleteOrderStatus = async (req, res) => {
    try {
        const { id } = req.body;
        await orderStatusUseCases.deleteOrderStatus(id);
        res.redirect("/settings/order-status");
    } catch (error) {
        console.error("Erro ao deletar status:", error);
        res.status(500).send("Erro ao deletar status");
    }
};

const changePaymentStatus = async (req, res) => {
    try {
        const paymentStatusList = await paymentStatusUseCases.getAllPaymentStatus();
        res.render("settings/paymentStatus", { paymentStatusList });
    } catch (error) {
        console.error("Erro ao carregar configurações de pagamento:", error);
        res.status(500).send("Erro interno ao carregar configurações");
    }
};

const createPaymentStatus = async (req, res) => {
    try {
        const { status_name } = req.body;
        await paymentStatusUseCases.createPaymentStatus(status_name);
        res.redirect("/settings/payment-status");
    } catch (error) {
        console.error("Erro ao criar status de pagamento:", error);
        res.status(500).send("Erro ao criar status");
    }
};

const deletePaymentStatus = async (req, res) => {
    try {
        const { id } = req.body;
        await paymentStatusUseCases.deletePaymentStatus(id);
        res.redirect("/settings/payment-status");
    } catch (error) {
        console.error("Erro ao deletar status de pagamento:", error);
        res.status(500).send("Erro ao deletar status");
    }
};


module.exports = {
    changeOrder,
    createOrderStatus,
    deleteOrderStatus,
    changePaymentStatus,
    createPaymentStatus,
    deletePaymentStatus
};
