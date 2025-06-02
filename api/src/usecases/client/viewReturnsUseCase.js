const returnRepository = new (require("../../repositories/returnRepository"))();

const ViewReturnsUseCase = async (userId) => {
    if (!userId) {
        throw new Error("ID do usuário não fornecido.");
    }

    const returns = await returnRepository.getReturnsByUserId(userId);

    return returns;
};

module.exports = ViewReturnsUseCase;
