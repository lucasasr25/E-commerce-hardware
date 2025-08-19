const OrderRepository = require("../../repositories/orderRepository");
const PaymentRepository = require("../../repositories/paymentRepository");
const AddressRepository = require("../../repositories/addressRepository");
const ClientRepository = require("../../repositories/clientRepository");
const ReturnRepository = require("../../repositories/returnRepository");
const CreditCardRepository = require("../../repositories/creditCardRepository");

class RenderClientUseCases {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.paymentRepository = new PaymentRepository();
    this.addressRepository = new AddressRepository();
    this.userRepository = new ClientRepository(); // You had userRepository and clientRepository the same
    this.clientRepository = new ClientRepository();
    this.returnRepository = new ReturnRepository();
    this.creditCardRepository = new CreditCardRepository();
  }

  async renderCardEdit(userId) {
    return await this.creditCardRepository.getCreditCardsByUserId(userId);
  }

  async renderClientDetail(id) {
    const client = await this.clientRepository.getClientById(id);

    if (!client) {
      throw new Error("Cliente não encontrado.");
    }

    return client;
  }

  async renderClientProfile(userId) {
    const client = await this.clientRepository.getClientById(userId);
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    const addresses = await this.addressRepository.getClientAddresses(userId);
    const cards = await this.creditCardRepository.getCreditCardsByUserId(userId);

    return { client, addresses, cards };
  }

  async renderClientsView(queryParams) {
    return await this.clientRepository.searchClients(queryParams);
  }

  async renderCreateView(req, res) {
    return {};
  }

  async renderEditView(id) {
    const clients = await this.clientRepository.searchClients({ id });

    if (clients.length === 0) {
      throw new Error("Cliente não encontrado");
    }

    const client = clients[0];
    return {
      client,
      addresses: client.addresses || [],
      phoneNumbers: client.phone_numbers || [],
    };
  }

  async renderOrders(userId) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const orders = await this.orderRepository.getAllOrders(userId);
    return orders;
  }

  async renderOrder(orderId) {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) throw new Error("Pedido não encontrado");

    const orderItems = await this.orderRepository.getItemsByOrderId(orderId);
    const address = await this.addressRepository.getById(order.address_id, "addresses");
    const paymentCards = await this.paymentRepository.getPaymentCardsByOrderId(orderId);

    return {
      ...order,
      address,
      orderItems,
      paymentCards,
    };
  }

  async searchClients(queryParams) {
    return await this.clientRepository.searchClients(queryParams);
  }

  async viewReturns(userId) {
    if (!userId) {
      throw new Error("ID do usuário não fornecido.");
    }

    const returns = await this.returnRepository.getReturnsByUserId(userId);
    return returns;
  }
}

module.exports = RenderClientUseCases;
