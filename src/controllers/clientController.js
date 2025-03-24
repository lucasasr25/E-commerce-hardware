const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const clientRepository = require("../repositories/clientRepository");
const addressRepository = require("../repositories/adressRepository");

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

    const { name, email, password, document, addresses} = req.body;
    
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const client = await clientRepository.registerClient(name, email, passwordHash, document, addresses);

        res.status(201).json({ message: "Client successfully registered!", client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateClient = async (req, res) => {
    
    // Captura os campos diretamente de req.body
    const { id, name, email, password, active, phoneNumbers, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode } = req.body;

    // Mapeia os endereços para um array de objetos
    const addresses = adr_type.map((type, i) => ({
        adr_type: type,
        nick: nick[i] || '',
        street: street[i] || '',
        number: number[i] || '',
        complement: complement[i] || '',
        neighborhood: neighborhood[i] || '',
        city: city[i] || '',
        state: state[i] || '',
        country: country[i] || '',
        zipcode: zipcode[i] || ''
    }));
    console.log(phoneNumbers);
    
    try {
        // Atualiza os dados do cliente no repositório
        const client = await clientRepository.updateClient(id, name, email, password, active, phoneNumbers, addresses);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.redirect(`/clientDetail?id=${id}`);
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

  const renderDetailView = async (req, res) => {
    try {
        const { id } = req.query;
        
        // Buscar o cliente com o ID específico
        const clients = await clientRepository.searchClients({ id });

        if (clients.length === 0) {
            return res.status(404).send("Cliente não encontrado.");
        }

        // Passar o cliente encontrado para a view com o nome 'client'
        res.render("detail", { client: clients[0] });  // Alterado 'clients' para 'client'
    } catch (error) {
        res.status(500).send("Erro ao buscar detalhes do cliente.");
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID do cliente da URL

        // Tenta deletar o cliente pelo ID
        const client = await clientRepository.deleteClient(id);

        if (!client) {
            return res.status(404).send("Cliente não encontrado.");
        }

        // Redireciona para a página de clientes após a exclusão
        res.redirect('/clients');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao deletar cliente");
    }
};
const renderEditView = async (req, res) => {
    try {
        const { id } = req.query;

        // Buscar o cliente com o ID específico
        const clients = await clientRepository.searchClients({ id });

        if (clients.length === 0) {
            return res.status(404).send("Cliente não encontrado.");
        }
        console.log(clients);
        // Passar o cliente, endereços e números de telefone para a view
        res.render("edit", { 
            client: clients[0], 
            addresses: clients[0].addresses || [],  // Garantir que addresses seja um array
            phoneNumbers: clients[0].phone_numbers || [] // Aqui está o campo correto
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar a página de edição");
    }
};



const renderCreateview = async (req, res) => {
    try {
        res.render("create", {});
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar a página de edição");
    }
};

const createClient = async (req, res) => {
    try {
        // Verificando o conteúdo de req.body
        console.log(req.body); // Verifique os dados recebidos

        const { name, email, password, document, active, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode, phoneNumbers } = req.body;

        // Tratar os valores dos arrays (pegando o primeiro valor para cada campo, pois você enviará múltiplos valores)
        const addresses = adr_type.map((type, i) => ({
            adr_type: type,
            nick: nick[i] || '',
            street: street[i] || '',
            number: number[i] || '',
            complement: complement[i] || '',
            neighborhood: neighborhood[i] || '',
            city: city[i] || '',
            state: state[i] || '',
            country: country[i] || '',
            zipcode: zipcode[i] || ''
        }));

        // Criação do cliente
        const newClient = await clientRepository.createClient(name, email, password, document, active);

        if (!newClient) {
            return res.status(400).send("Erro ao criar cliente");
        }

        // Criação dos endereços para o cliente
        const addressPromises = addresses.map((address) => {
            return addressRepository.createAddress(newClient.id, address.adr_type, address.nick, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, address.country, address.zipcode);
        });
        await Promise.all(addressPromises);

        // Criação dos números de telefone para o cliente
        if (phoneNumbers && phoneNumbers.length > 0) {
            const phonePromises = phoneNumbers.map((phoneNumber) => {
                return clientRepository.createPhone(newClient.id, phoneNumber);
            });
            await Promise.all(phonePromises);
        }

        // Redireciona para a página de detalhes do cliente
        res.redirect(`/clientDetail?id=${newClient.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar cliente e endereço");
    }
};








module.exports = { registerClient, validatePassword, updateClient, searchClients, renderClientsView, renderDetailView, renderEditView, createClient, renderCreateview, deleteClient};
