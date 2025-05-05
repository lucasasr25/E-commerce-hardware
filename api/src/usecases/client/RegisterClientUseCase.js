const clientRepository = require("../../repositories/clientRepository");

const RegisterClientUseCase =

    async (req,res) => {

        const { name, email, password, document, addresses } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const client = await clientRepository.registerClient(name, email, passwordHash, document, addresses);
        return client;
}

module.exports = RegisterClientUseCase;