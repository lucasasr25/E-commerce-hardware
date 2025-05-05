const clientRepository = require("../../repositories/clientRepository");

const RenderClientsViewUseCase =
async (req, res) => {
    const queryParams = req.query;
    return await clientRepository.searchClients(queryParams);
}

module.exports = RenderClientsViewUseCase;
