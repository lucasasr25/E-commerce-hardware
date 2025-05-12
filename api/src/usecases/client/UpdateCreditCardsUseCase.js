const clientRepository = require("../../repositories/clientRepository");

const UpdateCreditCardsUseCase =
async (userId) => {
    for (let i = 0; i < cardData.card_number.length; i++) {
        await clientRepository.updateCreditCard(
            userId,
            cardData.card_number[i],
            cardData.holder_name[i],
            cardData.expiration_date[i],
            cardData.is_default[i]
        );
    }
}

module.exports = UpdateCreditCardsUseCase;
