const express = require("express");
const router = express.Router();
const { validatePassword, updateClient, getClientOrders, searchClients, renderClientsView, renderDetailView, renderEditView, createClient, updateOrderStatus, renderCreateview, deleteClient} = require("../controllers/userController");


router.get("/clients", renderClientsView);
router.get("/clientDetail", renderDetailView);
router.get("/clientEditView", renderEditView);
router.post("/createClient", createClient);
router.get("/create", renderCreateview);
router.post("/clientEdit", updateClient);
router.get('/delete/:id', deleteClient);
router.get("/clientOders", getClientOrders);
router.post("/updateOrderStatus", updateOrderStatus);




module.exports = router;
