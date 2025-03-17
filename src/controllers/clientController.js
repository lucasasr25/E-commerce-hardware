const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const clientRepository = require("../repositories/clientRepository");

// Password validation
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

const registerClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, addresses } = req.body;
    
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const client = await clientRepository.registerClient(name, email, passwordHash, addresses);

        res.status(201).json({ message: "Client successfully registered!", client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, email, active } = req.body;

    try {
        const client = await clientRepository.updateClient(id, name, email, active);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json({ message: "Client successfully updated", client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchClients = async (req, res) => {
    try {
        const clients = await clientRepository.searchClients(req.query);
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Nova função para renderizar a view de clientes
const renderClientsView = async (req, res) => {
    try {
      const clients = await clientRepository.searchClients(req.query);
      res.render("list", { clients }); // Renderizar a view e passar os dados dos clientes
    } catch (error) {
      res.status(500).send("Erro ao buscar clientes.");
    }
  };

module.exports = { registerClient, validatePassword, updateClient, searchClients, renderClientsView};
