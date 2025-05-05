const paymentStatusRepository = require("../../repositories/paymentRepository");

const getAllPaymentStatus = async () => {
    return await paymentStatusRepository.getAllPaymentStatus();
};

const createPaymentStatus = async (status_name) => {
    return await paymentStatusRepository.createPaymentStatus(status_name);
};

const deletePaymentStatus = async (id) => {
    return await paymentStatusRepository.deletePaymentStatus(id);
};

module.exports = {
    getAllPaymentStatus,
    createPaymentStatus,
    deletePaymentStatus,
};
