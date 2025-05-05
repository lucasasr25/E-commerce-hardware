const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController.js");

router.get('/main', mainController.mainView);
router.get('/', mainController.mainView);


module.exports = router;
