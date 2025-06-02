const couponRepository = new (require('../../repositories/couponRepository'))();
const TradeCoupon = require('../../entities/TradeCoupon');

const createNewCoupon = async (user_id, value) => {
  try {
    const coupon = new TradeCoupon({ userId: user_id, value });
    return await couponRepository.createTradeCoupon(coupon);
  } catch (error) {
    throw new Error(`Erro ao criar cupom: ${error.message}`);
  }
};

module.exports = {
  createNewCoupon
};
