const CouponRepository = require('../../repositories/couponRepository');
const Coupon = require('../../entities/Coupon');

class CouponUseCases {
  constructor() {
    this.couponRepository = new CouponRepository();
  }

  async getAllCoupons() {
    return await this.couponRepository.getAllCoupons();
  }

  async validateCoupon(code) {
    const couponData = await this.couponRepository.getCoupon(code);
    if (!couponData) {
      return null;
    }

    try {
      const coupon = new Coupon(couponData);

      if (!coupon.isValid()) {
        return null;
      }

      return coupon;
    } catch (error) {
      return null;
    }
  }

  async createNewCoupon(code, discountPercentage, expirationDate) {
    try {
      const coupon = new Coupon({ code, discountPercentage, expirationDate });
      return await this.couponRepository.createCoupon(
        coupon.code,
        coupon.discountPercentage,
        coupon.expirationDate
      );
    } catch (error) {
      throw new Error(`Erro ao criar cupom: ${error.message}`);
    }
  }

  async removeCoupon(id) {
    return await this.couponRepository.deleteCoupon(id);
  }
}

module.exports = CouponUseCases;
