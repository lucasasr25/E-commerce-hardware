const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartContoller");
const checkoutController = require("../controllers/checkoutController");
const couponController = require("../controllers/couponController");


router.post("/add", cartController.addItemToCart);
router.get("/view", cartController.renderCartView);
router.post("/update", cartController.updateCartItemQuantity);
router.get("/getPreview", cartController.getCartItemsUser);
router.post("/aplicar-cupom", couponController.checkCoupoun);
router.get("/checkout", checkoutController.renderCheckoutView);
router.post("/checkout", checkoutController.checkout);
router.post("/remove/:product_id", cartController.removeItemFromCart);


module.exports = router;
