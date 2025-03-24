const express = require("express");
const router = express.Router();
const { validatePassword, updateClient, searchClients, renderClientsView } = require("../controllers/clientController");

// router.post("/clients", registerClient);
router.put("/clients/:id", updateClient);
router.get("/clients", searchClients);

module.exports = router;
