const { validationResult } = require("express-validator");
const ClientBuilderService = require('../services/ClientBuilderService');
const ClientUseCases = new (require('../usecases/client/ClientUseCases'))();
const RenderClientUseCases = new (require('../usecases/client/RenderClientUseCases'))();

const viewReturns = async (req, res) => {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).render("status/error", {
                message: "Usuário não autenticado.",
            });
        }

        const returns = await RenderClientUseCases.viewReturns(userId);

        res.render("user/returns", { returns });
    } catch (error) {
        console.error("Erro ao buscar trocas:", error);
        res.status(500).render("status/error", {
            message: error.message || "Erro ao buscar trocas.",
        });
    }
};

const renderOrders = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const orders = await RenderClientUseCases.renderOrders(userId);
        res.render("user/orderlist", { orders });
    } catch (error) {
        console.error("Erro ao obter pedidos:", error.message);
        const status = error.message === "Usuário não autenticado." ? 401 : 500;
        res.status(status).send(error.message);
    }
};

const renderOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await RenderClientUseCases.renderOrder(orderId);
        res.render("user/orders/details", { order });
    } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error.message);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao buscar detalhes do pedido:"
        });
    }
};

const returnOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await RenderClientUseCases.renderOrder(orderId);
        res.render("user/orders/return", { order });
    } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error.message);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao buscar detalhes do pedido:"
        });
    }
};

const getClientOrders = async (req, res) => {
    try {
        const clientId = req.query.id;

        if (!clientId) {
            return res.status(400).send("ID do cliente não fornecido.");
        }

        const { orders, statuses } = await ClientUseCases.getOrdersByClientId(clientId);

        res.render("client/clientOrders", { orders, statuses });

    } catch (error) {
        console.error("Erro ao buscar vendas do cliente:", error);
        res.status(500).send("Erro interno ao buscar vendas.");
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, statusId } = req.body;

        await ClientUseCases.updateOrderStatus({ orderId, statusId });

        res.redirect("back");
    } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        res.status(500).send("Erro ao atualizar status.");
    }
};



const registerClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const clientData = req.body;
        const client = await ClientUseCases.RegisterClientUseCases(clientData);
        // const client = await registerClientUseCases.execute({ name, email, password, document, addresses });

        res.status(201).json({ message: "Client successfully registered!", client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const registerReturn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const order_id = req.params.id; // Vindo da rota: /user/exchange/:id
        const user_id = req.user?.id || req.session.user?.id; // ou defina conforme sua autenticação
        const itemsToExchange = req.body.itemsToExchange; // Array de product_id

        if (!itemsToExchange || itemsToExchange.length === 0) {
            res.status(500).render("status/error", {
                message: "Nenhum item foi selecionado para troca.",
            });
        }

        const returnData = await ClientUseCases.registerReturn({
            user_id,
            order_id,
            product_ids: itemsToExchange
        });

        res.render('status/success', {
            message: "Troca registrada! Aguarde atualizações."
        });

    } catch (error) {

        res.status(500).render("status/error", {
            message: error.message || "Erro ao registrar troca:",
        });
    }
};


const updateClient = async (req, res) => {
    try {
        const clientData = ClientBuilderService.buildFromRequest(req.body);
        const updatedClient = await ClientUseCases.updateClientUseCases(clientData);
        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.redirect(`/user`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };


const searchClients = async (req, res) => {
    try {
        const queryParams = req.query;
        const clients = await RenderClientUseCases.searchClients(queryParams);
        res.json(clients);
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).json({ error: error.message });
    }
};

const renderClientsView = async (req, res) => {
    try {
        const queryParams = req.query;
        const clients = await RenderClientUseCases.renderClientsView(queryParams);
        res.render("client/list", { clients });
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao buscar clientes:"
        });
    }
};

const renderDetailView = async (req, res) => {
    try {
        const { id } = req.query;
        const client = await RenderClientUseCases.renderClientDetail(id);
        res.render("client/detail", { client });
    } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao buscar detalhes do cliente:"
        });
    }
};

const deleteClient = async (req, res) => {
    try {    
        const { id } = req.params;
        const deleteClientUseCases = await ClientUseCases.DeleteClientUseCases(id);
        res.redirect('/client/clients');
    } catch (error) {
        console.error(error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao deletar cliente"
        });
    }
};

const renderSettingsView = async (req, res) => {
    try {
        res.render("user/admin/settings");
    } catch (error) {
        console.error("Erro ao renderizar a tela de configurações:", error);
        res.status(500).render('status/error', {
            message: error.message || "Erro ao renderizar a tela de configurações:"
        });
    }
};


const renderEditView = async (req, res) => {
    try {
        const { id } = req.query;
        const data = await RenderClientUseCases.renderEditView(id);
        res.render("user/edit", { client: data.client, addresses: data.addresses, phoneNumbers: data.phoneNumbers });
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || "Erro ao renderizar a tela"
        });
    }
};

const renderCardEdit = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const creditCards = await RenderClientUseCases.renderCardEdit(userId);
        res.render('user/editCreditCards', { creditCards });
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || "Erro ao renderizar a tela"
        });
    }
};

const updateCreditCardsController = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const updateCreditCardsUseCase = await ClientUseCases.updateCreditCards(userId, req.body);
        res.redirect('/user');
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || 'Erro ao adicionar cartões de crédito.'
        });
    }
};

const renderClientProfile = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { client, addresses, cards } = await RenderClientUseCases.renderClientProfile(userId);
        res.render("user/profile", { client, addresses, cards });
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || 'Erro ao renderClientProfile'
        });
    }
};

const renderCreateview = async (req, res) => {
    try {
        const data = await ClientUseCases.renderCreateView(req,res);
        res.render("client/create", data);
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || "Erro ao carregar a página de criação"
        });
    }
};

const createClient = async (req, res) => {
    try {
        const clientData = ClientBuilderService.buildFromRequest(req.body);
        const newClient = await ClientUseCases.CreateClientUseCases(clientData);
        res.redirect(`/client/clientDetail?id=${newClient.id}`);
    } catch (error) {
        res.status(500).render('status/error', {
            message: error.message || "Erro ao criar cliente e endereço"
        });
    }
};

module.exports = { registerClient, viewReturns, updateOrderStatus, getClientOrders, renderOrderDetails, returnOrderDetails,  registerReturn , renderSettingsView, renderCardEdit, updateCreditCardsController, renderOrders, updateClient, searchClients, renderClientsView, renderClientProfile, renderDetailView, renderEditView, createClient, renderCreateview, deleteClient};
