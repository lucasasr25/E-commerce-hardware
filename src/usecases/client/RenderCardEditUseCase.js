const creditCardRepository = require("../../repositories/creditCardRepository");


const RenderCardEditUseCase =
    async (userId) => {
        return await creditCardRepository.getCreditCardsByUserId(userId);
    }


module.exports = RenderCardEditUseCase;
