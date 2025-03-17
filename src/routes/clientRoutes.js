const express = require("express");
const router = express.Router();
const { registerClient, validatePassword, updateClient, searchClients, renderClientsView } = require("../controllers/clientController");

router.post("/clients", validatePassword, registerClient);
router.put("/clients/:id", updateClient);
router.get("/clients", searchClients);


router.get("/clients/view", renderClientsView);


module.exports = router;
