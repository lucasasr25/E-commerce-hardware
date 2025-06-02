const {
    getAllCoupons,
    createNewCoupon,
    removeCoupon,
    validateCoupon
} = require('../usecases/coupon/couponUseCases');

const renderCouponsPage = async (req, res) => {
    try {
        const coupons = await getAllCoupons();
        res.render('settings/coupons', { coupons });
    } catch (error) {
        console.error('Erro ao obter cupons:', error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

const checkCoupoun = async (req, res) => {
    const { code } = req.body;

    try {
        const coupon = await validateCoupon(code);
        if (coupon) {
            res.status(200).send({
                message: "Cupom aplicado com sucesso!",
                discountPercentage: coupon.discount_percentage
            });
        } else {
            res.status(400).send({ message: "Cupom não encontrado" });
        }
    } catch (error) {
        console.error('Erro ao verificar cupom:', error);
        res.status(500).send({ message: "Erro ao verificar cupom" });
    }
};

const createCoupon = async (req, res) => {
    const { code, discountPercentage, expirationDate } = req.body;
    try {
        await createNewCoupon(code, discountPercentage, expirationDate);
        res.redirect('/settings/coupons');
    } catch (error) {
        console.error('Erro ao criar cupom:', error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        await removeCoupon(id);
        res.redirect('/settings/coupons');
    } catch (error) {
        console.error('Erro ao deletar cupom:', error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};

module.exports = {
    renderCouponsPage,
    createCoupon,
    deleteCoupon,
    checkCoupoun
};
