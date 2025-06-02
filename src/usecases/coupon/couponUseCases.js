const couponRepository = new (require('../../repositories/couponRepository'))();
const Coupon = require('../../entities/Coupon');

const getAllCoupons = async () => {
  return await couponRepository.getAllCoupons();
};

const validateCoupon = async (code) => {
  const couponData = await couponRepository.getCoupon(code);
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
};

const createNewCoupon = async (code, discountPercentage, expirationDate) => {
  try {
    const coupon = new Coupon({ code, discountPercentage, expirationDate });
    return await couponRepository.createCoupon(coupon.code, coupon.discountPercentage, coupon.expirationDate);
  } catch (error) {
    throw new Error(`Erro ao criar cupom: ${error.message}`);
  }
};

const removeCoupon = async (id) => {
  return await couponRepository.deleteCoupon(id);
};

module.exports = {
  getAllCoupons,
  validateCoupon,
  createNewCoupon,
  removeCoupon,
};
