class PaymentStatusUseCases {
  
  constructor({ paymentStatusRepository }) {
    this.paymentStatusRepository = paymentStatusRepository;
  }

  async getAllPaymentStatus() {
    return await this.paymentStatusRepository.getAllPaymentStatus();
  }

  async createPaymentStatus(status_name) {
    return await this.paymentStatusRepository.createPaymentStatus(status_name);
  }

  async deletePaymentStatus(id) {
    return await this.paymentStatusRepository.deletePaymentStatus(id);
  }
}

module.exports = PaymentStatusUseCases;
