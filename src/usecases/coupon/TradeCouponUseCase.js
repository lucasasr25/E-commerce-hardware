const CouponRepository = require('../../repositories/couponRepository');
const TradeCoupon = require('../../entities/TradeCoupon');

class TradeCouponUseCase {
  constructor() {
    this.couponRepository = new CouponRepository();
  }

  async createNewCoupon(user_id, value) {
    try {
      const coupon = new TradeCoupon({ userId: user_id, value });
      return await this.couponRepository.createTradeCoupon(coupon);
    } catch (error) {
      throw new Error(`Erro ao criar cupom: ${error.message}`);
    }
  }
}

module.exports = TradeCouponUseCase;
