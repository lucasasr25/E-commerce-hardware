const express = require("express");
const router = express.Router();
const { validatePassword, updateClient, searchClients, renderClientsView, renderDetailView, renderEditView, createClient, renderCreateview, deleteClient} = require("../controllers/clientController");


router.get("/clients", renderClientsView);
router.get("/clientDetail", renderDetailView);
router.get("/clientEditView", renderEditView);
router.post("/createClient", createClient);
router.get("/create", renderCreateview);
router.post("/clientEdit", updateClient);
router.get('/delete/:id', deleteClient);


module.exports = router;
