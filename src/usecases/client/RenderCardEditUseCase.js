const clientRepository = require("../../repositories/clientRepository");


const RenderCardEditUseCase =
    async (req, res) => {
        const userId = req.session.user?.id;
        return await clientRepository.getCreditCardsByUserId(userId);
    }


module.exports = RenderCardEditUseCase;
