const couponRepository = require('../repositories/couponRepository');

// Renderiza a página de cupons
const renderCouponsPage = async (req, res) => {
    try {
        const coupons = await couponRepository.getAllCoupons();
        res.render('settings/coupons', { coupons });
    } catch (error) {
        console.error('Erro ao obter cupons:', error);
        res.status(500).send("Erro ao carregar cupons");
    }
};

// Cria um novo cupom promocional
const createCoupon = async (req, res) => {
    const { code, discountPercentage, expirationDate } = req.body;
    try {
        const coupon = await couponRepository.createCoupon(code, discountPercentage, expirationDate);
        res.redirect('/settings/coupons');  // Redireciona para a página de cupons
    } catch (error) {
        console.error('Erro ao criar cupom:', error);
        res.status(500).send("Erro ao criar cupom");
    }
};

// Deleta um cupom promocional
const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await couponRepository.deleteCoupon(id);
        res.redirect('/settings/coupons');  // Redireciona para a página de cupons
    } catch (error) {
        console.error('Erro ao deletar cupom:', error);
        res.status(500).send("Erro ao deletar cupom");
    }
};

module.exports = {
    renderCouponsPage,
    createCoupon,
    deleteCoupon
};
