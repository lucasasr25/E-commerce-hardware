const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const couponController = require('../controllers/couponController');
const stockController = require("../controllers/stockController");

router.get('/coupons', couponController.renderCouponsPage);
router.post('/coupons', couponController.createCoupon);
router.post('/coupons/:id/delete', couponController.deleteCoupon);


router.get("/order-status", settingsController.changeOrder);
router.post("/order-status/create", settingsController.createOrderStatus);
router.post("/order-status/delete", settingsController.deleteOrderStatus);


router.get("/suppliers", settingsController.productSupplier);
router.post("/product-supplier/create", settingsController.createProductSupplier);
router.post("/product-supplier/delete", settingsController.deleteProductSupplier);

router.get("/pricebook", settingsController.pricebook);
router.post("/pricebook/create", settingsController.createPricebook);
router.post("/pricebook/delete", settingsController.deletePricebook);

router.get("/product-category", settingsController.productCategories);
router.post("/product-category/create", settingsController.createProductCategories);
router.post("/product-category/delete", settingsController.deleteProductCategories);

router.get("/payment-status", settingsController.changePaymentStatus);
router.post("/payment-status/create", settingsController.createPaymentStatus);
router.post("/payment-status/delete", settingsController.deletePaymentStatus);


router.get('/return-status', settingsController.changeReturnStatus);
router.post('/return-status/create', settingsController.createReturnStatus);
router.post('/return-status/delete', settingsController.deleteReturnStatus);

router.get("/entry", stockController.showEntryForm);
router.post("/entry", stockController.manualEntry);

router.get('/returns', settingsController.viewReturns);


router.post('/exchange/update-status', settingsController.updateExchangeStatus);



module.exports = router;