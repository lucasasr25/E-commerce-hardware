const clientRepository = new (require("../../repositories/clientRepository"))();

const RenderClientsViewUseCase =
async (queryParams) => {
    return await clientRepository.searchClients(queryParams);
}

module.exports = RenderClientsViewUseCase;
