const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");


router.get("/", userController.renderClientProfile);
router.get("/userEditView", userController.renderEditView);
router.get("/card", userController.renderCardEdit);
router.get("/settings", userController.renderSettingsView)
router.post("/cardUpdate", userController.updateCreditCardsController)
router.get("/orders", userController.renderOrders)
router.get("/orders/:id", userController.renderOrderDetails);

module.exports = router;