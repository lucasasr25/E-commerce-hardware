class OrderStatusUseCases {
  constructor({ orderRepository }) {
    this.orderRepository = orderRepository;
  }

  async getAllOrderStatus() {
    return await this.orderRepository.getAllOrderStatus();
  }

  async createOrderStatus(status_name) {
    return await this.orderRepository.createOrderStatus(status_name);
  }

  async deleteOrderStatus(id) {
    return await this.orderRepository.deleteOrderStatus(id);
  }
}

module.exports = OrderStatusUseCases;
