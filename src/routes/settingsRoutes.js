const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const couponController = require('../controllers/couponController');


router.get('/coupons', couponController.renderCouponsPage);
router.post('/coupons', couponController.createCoupon);
router.post('/coupons/:id/delete', couponController.deleteCoupon);

router.get("/order-status", settingsController.changeOrder);
router.post("/order-status/create", settingsController.createOrderStatus);
router.post("/order-status/delete", settingsController.deleteOrderStatus);


router.get("/payment-status", settingsController.changePaymentStatus);
router.post("/payment-status/create", settingsController.createPaymentStatus);
router.post("/payment-status/delete", settingsController.deletePaymentStatus);


module.exports = router;