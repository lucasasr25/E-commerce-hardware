const CouponRepository = require("../repositories/couponRepository");
const CouponUseCasesClass = require("../usecases/coupon/CouponUseCases");
const TradeCouponUseCaseClass = require("../usecases/coupon/TradeCouponUseCase");

const repositories = {
  couponRepository: new CouponRepository(),
};

const CouponUseCases = new CouponUseCasesClass({
  couponRepository: repositories.couponRepository,
});

const TradeCouponUseCases = new TradeCouponUseCaseClass({
  couponRepository: repositories.couponRepository,
});

const renderCouponsPage = async (req, res) => {
    try {
        const coupons = await CouponUseCases.getAllCoupons();
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
        const coupon = await CouponUseCases.validateCoupon(code);
        if (coupon) {
            res.status(200).send({
                message: "Cupom aplicado com sucesso!",
                discountPercentage: coupon.discountPercentage
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
        await CouponUseCases.createNewCoupon(code, discountPercentage, expirationDate);
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
        await CouponUseCases.removeCoupon(id);
        res.redirect('/settings/coupons');
    } catch (error) {
        console.error('Erro ao deletar cupom:', error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao processar o pedido."
        });
    }
};


const checkExchangeCoupoun = async (req, res) => {
    const { codes } = req.body;

    try {
        const { appliedCoupons, invalidCoupons } = await TradeCouponUseCases.validateCoupons(codes);

        if (appliedCoupons.length > 0) {
            res.status(200).send({
                message: "Cupons processados!",
                appliedCoupons,
                invalidCoupons
            });
        } else {
            res.status(400).send({
                message: "Nenhum cupom válido encontrado",
                invalidCoupons
            });
        }
    } catch (error) {
        console.error('Erro ao verificar cupons:', error);
        res.status(500).send({ message: "Erro ao verificar cupons" });
    }
};

module.exports = { checkExchangeCoupoun };


module.exports = {
    renderCouponsPage,
    createCoupon,
    deleteCoupon,
    checkCoupoun,
    checkExchangeCoupoun
};
