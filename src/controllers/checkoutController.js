const CheckoutUseCasesClass = require('../usecases/checkout/CheckoutUseCases');
const ClientRepository = require('../repositories/clientRepository');
const CartRepository = require('../repositories/cartRepository');
const OrderRepository = require('../repositories/orderRepository');
const CouponRepository = require('../repositories/couponRepository');
const StockRepository = require('../repositories/stockRepository');
const CreditCardRepository = require('../repositories/creditCardRepository');
const StockUseCasesClass = require('../usecases/stock/StockUseCases');

const stockRepository = new StockRepository();
const stockUseCases = new StockUseCasesClass({ stockRepository });

const clientRepository = new ClientRepository();
const cartRepository = new CartRepository();
const orderRepository = new OrderRepository();
const couponRepository = new CouponRepository();
const creditCardRepository = new CreditCardRepository();

const checkoutUseCases = new CheckoutUseCasesClass({
    stockUseCases,
    clientRepository,
    cartRepository,
    orderRepository,
    couponRepository,
    stockRepository, 
    creditCardRepository
});
const renderCheckoutView = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const checkoutData = await checkoutUseCases.getCheckoutData(userId);
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
        const { promotionalCupomCode, pagamentos_cartao, cupons_troca } = req.body;

        await checkoutUseCases.createOrderFromCart(userId, promotionalCupomCode, cupons_troca, pagamentos_cartao);

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
