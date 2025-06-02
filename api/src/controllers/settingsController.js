const orderStatusUseCases = require("../usecases/settings/orderStatusUseCases");
const paymentStatusUseCases = require("../usecases/settings/paymentStatusUseCases");
const returnStatusUseCases = require("../usecases/settings/returnStatusUseCases");
const viewExchanges = require("../usecases/settings/viewExchanges");
const updateExchangeStatusUseCase = require("../usecases/settings/UpdateExchangeStatusUseCase");



const changeOrder = async (req, res) => {
    try {
        const orderStatusList = await orderStatusUseCases.getAllOrderStatus();
        res.render("settings/orderStatus", { orderStatusList });
    } catch (error) {
        console.error("Erro ao carregar configurações de pedido:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};


const updateExchangeStatus = async (req, res) => {
    try {
        const { exchangeID, statusId } = req.body; 
        console.log(req.body);
        await updateExchangeStatusUseCase.execute(exchangeID, statusId);

        res.redirect('/settings/returns');
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};


const createOrderStatus = async (req, res) => {
    try {
        const { status_name } = req.body;
        await orderStatusUseCases.createOrderStatus(status_name);
        res.redirect("/settings/order-status");
    } catch (error) {
        console.error("Erro ao criar status:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao criar status:"
        });
    }
};

const deleteOrderStatus = async (req, res) => {
    try {
        const { id } = req.body;
        await orderStatusUseCases.deleteOrderStatus(id);
        res.redirect("/settings/order-status");
    } catch (error) {
        console.error("Erro ao deletar status:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao deletar status:"
        });
    }
};

const changePaymentStatus = async (req, res) => {
    try {
        const paymentStatusList = await paymentStatusUseCases.getAllPaymentStatus();
        res.render("settings/paymentStatus", { paymentStatusList });
    } catch (error) {
        console.error("Erro ao carregar configurações de pagamento:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao carregar configurações de pagamento:"
        });
    }
};

const createPaymentStatus = async (req, res) => {
    try {
        const { status_name } = req.body;
        await paymentStatusUseCases.createPaymentStatus(status_name);
        res.redirect("/settings/payment-status");
    } catch (error) {
        console.error("Erro ao criar status de pagamento:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao criar status"
        });
    }
};

const deletePaymentStatus = async (req, res) => {
    try {
        const { id } = req.body;
        await paymentStatusUseCases.deletePaymentStatus(id);
        res.redirect("/settings/payment-status");
    } catch (error) {
        console.error("Erro ao deletar status de pagamento:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao deletar status"
        });
    }
};


const changeReturnStatus = async (req, res) => {
    try {
        const returnStatusList = await returnStatusUseCases.getAllReturnStatus();
        res.render("settings/returnStatus", { returnStatusList });
    } catch (error) {
        console.error("Erro ao carregar configurações de devolução:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao carregar status de devolução."
        });
    }
};

const createReturnStatus = async (req, res) => {
    try {
        const { name, description } = req.body;
        await returnStatusUseCases.createReturnStatus(name, description);
        res.redirect("/settings/return-status");
    } catch (error) {
        console.error("Erro ao criar status de devolução:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao criar status de devolução."
        });
    }
};

const deleteReturnStatus = async (req, res) => {
    try {
        const { id } = req.body;
        await returnStatusUseCases.deleteReturnStatus(id);
        res.redirect("/settings/return-status");
    } catch (error) {
        console.error("Erro ao deletar status de devolução:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao deletar status de devolução."
        });
    }
};


const viewReturns = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).render("status/error", {
                message: "Usuário não autenticado.",
            });
        }
        const {returns, statuses} = await viewExchanges(userId);
        res.render("settings/returns", { returns, statuses });
    } catch (error) {
        console.error("Erro ao buscar trocas:", error);
        res.status(500).render("status/error", {
            message: error.message || "Erro ao buscar trocas.",
        });
    }
};



module.exports = {
    changeOrder,
    createOrderStatus,
    deleteOrderStatus,
    changePaymentStatus,
    createPaymentStatus,
    changeReturnStatus,
    createReturnStatus,
    deleteReturnStatus,
    deletePaymentStatus,
    viewReturns,
    updateExchangeStatus
};
