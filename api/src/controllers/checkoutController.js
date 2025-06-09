const CheckoutUseCases = new (require('../usecases/checkout/CheckoutUseCases'))();


const renderCheckoutView = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const checkoutData = await CheckoutUseCases.getCheckoutData(userId);
        res.render("shopping/checkout", checkoutData);
    } catch (error) {
        console.error("Erro ao renderizar checkout:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

const checkout = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { promotionalCupomCode, pagamentos_cartao } = req.body;

        await CheckoutUseCases.createOrderFromCart(userId, promotionalCupomCode, pagamentos_cartao);

        res.render('status/success', {
            message: "Pedido realizado com sucesso!"
        });
    } catch (error) {
        console.error("Erro no checkout:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};


module.exports = {
    renderCheckoutView,
    checkout
};
