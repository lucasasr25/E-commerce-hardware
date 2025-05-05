const couponRepository = require('../../repositories/couponRepository');

const getAllCoupons = async () => {
    return await couponRepository.getAllCoupons();
};

const validateCoupon = async (code) => {
    return await couponRepository.getCoupon(code);
};

const createNewCoupon = async (code, discountPercentage, expirationDate) => {
    return await couponRepository.createCoupon(code, discountPercentage, expirationDate);
};

const removeCoupon = async (id) => {
    return await couponRepository.deleteCoupon(id);
};

module.exports = {
    getAllCoupons,
    validateCoupon,
    createNewCoupon,
    removeCoupon
};
