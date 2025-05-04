const clientRepository = require("../../repositories/clientRepository");

const SearchClientsUseCase =
async (req, res) => {
    const queryParams = req.query;
    return await clientRepository.searchClients(queryParams);
}


module.exports = SearchClientsUseCase;
