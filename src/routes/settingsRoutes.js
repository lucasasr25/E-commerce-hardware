const express = require("express");
const router = express.Router();
const orderSettingsController = require("../controllers/orderSettingsController");
const couponController = require('../controllers/couponController');

router.get("/order-status", orderSettingsController.changeOrder);
router.get('/coupons', couponController.renderCouponsPage);
router.post('/coupons', couponController.createCoupon);
router.post('/coupons/:id/delete', couponController.deleteCoupon);
router.post("/order-status/create", orderSettingsController.createOrderStatus);
router.post("/order-status/delete", orderSettingsController.deleteOrderStatus);

module.exports = router;