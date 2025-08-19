const OrderRepository = require("../../repositories/orderRepository");

class OrderStatusUseCases {
  constructor() {
    this.orderRepository = new OrderRepository();
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
