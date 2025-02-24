const express = require("express");
const router = express.Router();
const { registerClient, validatePassword, updateClient, searchClients } = require("../controllers/clientController");

router.post("/clients", validatePassword, registerClient);
router.put("/clients/:id", updateClient);
router.get("/clients", searchClients);

module.exports = router;
