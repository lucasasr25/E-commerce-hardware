const returnStatusRepository = require("../../repositories/returnStatusRepository");

const getAllReturnStatus = async () => {
    return await returnStatusRepository.findAll();
};

const createReturnStatus = async (name, description) => {
    if (!name) throw new Error("Nome do status é obrigatório.");
    return await returnStatusRepository.create({ name, description });
};

const deleteReturnStatus = async (id) => {
    if (!id) throw new Error("ID inválido para exclusão.");
    return await returnStatusRepository.delete(id);
};

module.exports = {
    getAllReturnStatus,
    createReturnStatus,
    deleteReturnStatus,
};
