const CouponRepository = require('../../repositories/couponRepository');
const TradeCoupon = require('../../entities/TradeCoupon');

class TradeCouponUseCase {
  constructor() {
    this.couponRepository = new CouponRepository();
  }


  async validateCoupons(codes) {
      const appliedCoupons = [];
      const invalidCoupons = [];
      const seenCodes = new Set();

      for (const code of codes) {
          if (seenCodes.has(code)) {
              invalidCoupons.push({ code, message: 'Cupom duplicado' });
              continue;
          }

          seenCodes.add(code);

          try {
              const couponData = await this.couponRepository.getTradeCoupon(code);
              if (!couponData) {
                  invalidCoupons.push({ code, message: 'Cupom não encontrado' });
              } else if (couponData.used) {
                  invalidCoupons.push({ code, message: 'Cupom já utilizado' });
              } else {
                  appliedCoupons.push({
                      code: couponData.code,
                      discountPercentage: couponData.value,
                  });
              }
          } catch (error) {
              invalidCoupons.push({ code, message: 'Erro ao validar cupom' });
          }
      }
      return { appliedCoupons, invalidCoupons };
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
