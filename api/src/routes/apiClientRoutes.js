const express = require("express");
const router = express.Router();
const { validatePassword, createClientAPI, updateClient, searchClients, renderClientsView } = require("../controllers/clientController");

// router.post("/clients", registerClient);
router.put("/clients/:id", updateClient);
router.post("/client", createClientAPI);

module.exports = router;
