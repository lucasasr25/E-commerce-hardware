const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const clientUseCase = require('../usecases/client');

const validatePassword = [
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[\W]/).withMessage("Password must contain at least one special character"),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    })
];


const renderOrders = async (req, res) => {
    try {
        const orders = await clientUseCase.RenderOrdersUseCase(req, res);
        res.render("user/orders/list", { orders });
    } catch (error) {
        console.error("Erro ao obter pedidos:", error.message);
        const status = error.message === "Usuário não autenticado." ? 401 : 500;
        res.status(status).send(error.message);
    }
};

const registerClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const client = await clientUseCase.RegisterClientUseCase(req, res);
        // const client = await registerClientUseCase.execute({ name, email, password, document, addresses });

        res.status(201).json({ message: "Client successfully registered!", client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateClient = async (req, res) => {
    try {
      const updatedClient = await clientUseCase.updateClientUseCase(req, res);
  
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
        const clients = await clientUseCase.SearchClientsUseCase(req, res);
        res.json(clients);
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).json({ error: error.message });
    }
};

const renderClientsView = async (req, res) => {
    try {
        const clients = await clientUseCase.RenderClientsViewUseCase(req,res);
        res.render("client/list", { clients });
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).send("Erro ao buscar clientes.");
    }
};

const renderDetailView = async (req, res) => {
    try {
        const client = await clientUseCase.RenderClientDetailUseCase(req,res);
        res.render("client/detail", { client });
    } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
        res.status(500).send("Erro ao buscar detalhes do cliente.");
    }
};

const deleteClient = async (req, res) => {
    try {    
        const deleteClientUseCase = await clientUseCase.DeleteClientUseCase(req, res);
        res.redirect('/client/clients');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao deletar cliente");
    }
};

const renderSettingsView = async (req, res) => {
    try {
        res.render("user/admin/settings");
    } catch (error) {
        console.error("Erro ao renderizar a tela de configurações:", error);
        res.status(500).send("Erro ao carregar a tela de configurações");
    }
};


const renderEditView = async (req, res) => {
    try {
        const data = await clientUseCase.RenderEditViewUseCase(req, res);
        res.render("client/edit", { client: data.client, addresses: data.addresses, phoneNumbers: data.phoneNumbers });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const renderCardEdit = async (req, res) => {
    try {
        const creditCards = await clientUseCase.RenderCardEditUseCase(req, res);
        res.render('user/editCreditCards', { creditCards });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateCreditCardsController = async (req, res) => {
    try {
        // const userId = req.session.user?.id;
        const updateCreditCardsUseCase = await clientUseCase.UpdateCreditCardsUseCase(req, res);
        res.redirect('/user');
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar cartões de crédito.' });
    }
};

const renderClientProfile = async (req, res) => {
    try {
        const { client, addresses, cards } = await clientUseCase.RenderClientProfileUseCase(req);
        res.render("user/profile", { client, addresses, cards });
    } catch (error) {
        res.status(500).send(error.message);
    }
};



const renderCreateview = async (req, res) => {
    try {
        const data = await clientUseCase.RenderCreateViewUseCase(req,res);
        res.render("client/create", data);
    } catch (error) {
        res.status(500).send("Erro ao carregar a página de criação");
    }
};

const createClient = async (req, res) => {
    try {
        const newClient = await clientUseCase.CreateClientUseCase(req,res);
        res.redirect(`/client/clientDetail?id=${newClient.id}`);
    } catch (error) {
        res.status(500).send("Erro ao criar cliente e endereço");
    }
};

module.exports = { registerClient, renderSettingsView, renderCardEdit, updateCreditCardsController, renderOrders, validatePassword, updateClient, searchClients, renderClientsView, renderClientProfile, renderDetailView, renderEditView, createClient, renderCreateview, deleteClient};
