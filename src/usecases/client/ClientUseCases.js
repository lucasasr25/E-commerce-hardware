const bcrypt = require("bcrypt");
const { Client, CreditCard } = require("../../entities/Client");

class ClientUseCases {
  constructor({
    clientRepository,
    addressRepository,
    phoneRepository,
    creditCardRepository,
    orderRepository,
    orderStatusRepository,
    returnRepository,
    tradeCouponUseCases,
  }) {
    this.clientRepository = clientRepository;
    this.addressRepository = addressRepository;
    this.phoneRepository = phoneRepository;
    this.creditCardRepository = creditCardRepository;
    this.orderRepository = orderRepository;
    this.orderStatusRepository = orderStatusRepository;
    this.returnRepository = returnRepository;
    this.tradeCouponUseCases = tradeCouponUseCases;
  }

  async createClient(clientData) {
    const client = new Client(clientData);
    const savedClient = await this.clientRepository.createClient(client.toDTO());

    for (const addr of client.getAddressesDTO()) {
      await this.addressRepository.createAddress(savedClient.id, addr);
    }

    for (const card of client.getCreditCardsDTO()) {
      await this.creditCardRepository.createCard(savedClient.id, card);
    }

    for (const phone of client.getPhoneNumbers()) {
      await this.phoneRepository.createPhone(savedClient.id, phone);
    }

    return {
      ...savedClient,
      addresses: client.getAddressesDTO(),
      creditCards: client.getCreditCardsDTO(),
      phoneNumbers: client.getPhoneNumbers(),
    };
  }

  async deleteClient(id) {
    const client = await this.clientRepository.deleteClient(id);

    if (!client) {
      throw new Error("Cliente não encontrado.");
    }

    return client;
  }

  async getOrdersByClientId(clientId) {
    const orders = await this.orderRepository.getOrdersByClientId(clientId);
    const statuses = await this.orderRepository.getAllOrderStatus();
    return { orders, statuses };
  }

  async registerClient(clientData) {
    const { name, email, password, document, addresses } = clientData;
    const passwordHash = await bcrypt.hash(password, 10);
    const client = await this.clientRepository.registerClient(name, email, passwordHash, document, addresses);
    return client;
  }

  async registerReturn(data) {
    const { user_id, order_id, product_ids } = data;
    const order = await this.orderRepository.getOrderById(order_id);
    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    const order_items = await this.orderRepository.getItemsByOrderId(order_id);
    const approvedID = await this.orderStatusRepository.getStatusID("EM ABERTO");
    if (!approvedID) {
      throw new Error("Status de troca não encontrado.");
    }

    if (order.status_id !== approvedID.id) {
      throw new Error("Não é possível solicitar troca para este pedido. Status inválido.");
    }

    const results = [];

    for (const product_id of product_ids) {
      const order_item = order_items.find(item => item.product_id.toString() === product_id.toString());
      if (!order_item) {
        throw new Error(`Produto com ID ${product_id} não encontrado no pedido.`);
      }

      const value = parseFloat(order_item.price);
      const createdCoupon = await this.tradeCouponUseCases.createNewCoupon(user_id, value);
      const result = await this.returnRepository.createReturn({
        user_id,
        order_id,
        product_id,
        trade_coupon_id: createdCoupon.id,
        quantity: 1,
      });

      results.push(result);
    }

    const orderStatus = await this.orderStatusRepository.getStatusID("TROCA SOLICITADA");
    if (!orderStatus) {
      throw new Error("Status de troca não encontrado.");
    }
    await this.orderRepository.updateOrderStatus(order_id, orderStatus.id);

    return results;
  }

async updateClient(clientData) {
    const clientEntity = new Client(clientData);
    const id = clientEntity.id;
    const name = clientEntity.name;
    const email = clientEntity.email;
    const password = clientEntity.password;
    const active = clientEntity.active;
    const phoneNumbers = clientEntity.getPhoneNumbers();
    const addresses = clientEntity.getAddressesDTO();

    try {
        // Atualiza tudo de uma vez, inclusive endereços
        const updatedClient = await this.clientRepository.updateClient(
            id, name, email, password, active, phoneNumbers, addresses
        );

        // Remove estas linhas duplicadas
        // await this.phoneRepository.deletePhonesByUserId(clientEntity.id);
        // for (const phone of clientEntity.getPhoneNumbers()) {
        //   await this.phoneRepository.createPhone(clientEntity.id, phone);
        // }
        //
        // await this.addressRepository.deleteAddressesByUserId(clientEntity.id);
        // for (const addr of clientEntity.getAddressesDTO()) {
        //   await this.addressRepository.createAddress(clientEntity.id, addr);
        // }

        return updatedClient;
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        return null;
    }
}

  async updateCreditCards(userId, cardData) {

    const defaultCount = cardData.is_default?.filter(val => val === 'on').length || 0;
    if (defaultCount > 1) {
        throw new Error("Apenas um cartão pode ser marcado como padrão.");
    }


    const creditCards = cardData.card_number.map((num, i) => new CreditCard({
      card_number: num,
      holder_name: cardData.holder_name[i],
      expiration_date: cardData.expiration_date[i],
      flag: cardData.flag[i],
      is_default: cardData.is_default[i],
    }));
    for (const card of creditCards) {
      // console.log(card);
      await this.creditCardRepository.updateCreditCard(
        userId,
        card.card_number,
        card.holder_name,
        card.expiration_date,
        card.flag,
        card.is_default
      );
    }
  }

  async updateOrderStatus({ orderId, statusId }) {
    if (!orderId || !statusId) {
      throw new Error("Parâmetros obrigatórios ausentes.");
    }

    const updated = await this.orderRepository.updateOrderStatus(orderId, statusId);
    return updated;
  }
}

module.exports = ClientUseCases;
