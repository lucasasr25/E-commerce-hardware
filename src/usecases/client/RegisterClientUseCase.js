const clientRepository = require("../../repositories/clientRepository");

const RegisterClientUseCase =

    async (clientData) => {

        const { name, email, password, document, addresses } = clientData;
        const passwordHash = await bcrypt.hash(password, 10);
        const client = await clientRepository.registerClient(name, email, passwordHash, document, addresses);
        return client;
}

module.exports = RegisterClientUseCase;