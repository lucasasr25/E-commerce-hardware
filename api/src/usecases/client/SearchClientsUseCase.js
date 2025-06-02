const clientRepository = new (require("../../repositories/clientRepository"))();

const SearchClientsUseCase =
async (queryParams) => {
    return await clientRepository.searchClients(queryParams);
}


module.exports = SearchClientsUseCase;
