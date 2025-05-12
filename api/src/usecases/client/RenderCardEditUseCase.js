const clientRepository = require("../../repositories/clientRepository");


const RenderCardEditUseCase =
    async (userId) => {
        return await clientRepository.getCreditCardsByUserId(userId);
    }


module.exports = RenderCardEditUseCase;
