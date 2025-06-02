const clientRepository = new (require("../../repositories/clientRepository"))();
const addressRepository = new (require("../../repositories/addressRepository"))();
const phoneRepository = new (require("../../repositories/phoneRepository"))();
const creditCardRepository = new (require("../../repositories/creditCardRepository"))();
const orderRepository = new (require("../../repositories/orderRepository"))();
const orderStatusRepository = new (require("../../repositories/orderStatusRepository"))();
const returnRepository = new (require("../../repositories/returnRepository"))();
const tradeCoupon = require("../coupon/tradeCouponUseCase.js");

const {Client, Address, CreditCard} = require("../../entities/Client");


const CreateClientUseCase = async (clientData) => {
    const client = new Client(clientData);
    const savedClient = await clientRepository.createClient(client.toDTO());
    for (const addr of client.getAddressesDTO()) {
        await addressRepository.createAddress(savedClient.id, addr);
    }

    for (const card of client.getCreditCardsDTO()) {
        await creditCardRepository.createCard(savedClient.id, card);
    }

    for (const phone of client.getPhoneNumbers()) {
        await phoneRepository.createPhone(savedClient.id, phone);
    }

    return {
        ...savedClient,
        addresses: client.getAddressesDTO(),
        creditCards: client.getCreditCardsDTO(),
        phoneNumbers: client.getPhoneNumbers()
    };
};

const DeleteClientUseCase =
    async (id) => {

        const client = await clientRepository.deleteClient(id);
        
        if (!client) {
            throw new Error("Cliente não encontrado.");
        }

        return client;
};

const GetOrdersByClientIdUseCase = async (clientId) => {
    const orders = await orderRepository.getOrdersByClientId(clientId);
    const statuses = await orderRepository.getAllOrderStatus();
    return {orders, statuses};
};

const RegisterClientUseCase = async (clientData) => {
    const { name, email, password, document, addresses } = clientData;
    const passwordHash = await bcrypt.hash(password, 10);
    const client = await clientRepository.registerClient(name, email, passwordHash, document, addresses);
    return client;
};

const RegisterReturnUseCase = async (data) => {
    const { user_id, order_id, product_ids } = data;
    const order = await orderRepository.getOrderById(order_id);
        if (!order) {
        throw new Error("Pedido não encontrado.");
    }
    const order_items = await orderRepository.getItemsByOrderId(order_id);
    const approvedID = await orderStatusRepository.getStatusID("APROVADO");
    // console.log(approvedID)
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
        const createdCoupon = await tradeCoupon.createNewCoupon(user_id, value);
        console.log(createdCoupon);
        const result = await returnRepository.createReturn({
            user_id,
            order_id,
            product_id,
            trade_coupon_id: createdCoupon.id,
            quantity: 1
        });

        results.push(result);
    }

    const orderStatus = await orderStatusRepository.getStatusID("TROCA SOLICITADA");
    if (!orderStatus) {
        throw new Error("Status de troca não encontrado.");
    }
    await orderRepository.updateOrderStatus(order_id, orderStatus.id);

    return results;
};



const updateClientUseCase = async (clientData) => {
    console.log(clientData);
    const clientEntity = new Client(clientData);
    try {
        const updatedClient = await clientRepository.updateClient(
            clientEntity,
        );

        await phoneRepository.deletePhonesByUserId(clientEntity.id);
        for (const phone of clientEntity.getPhoneNumbers()) {
            await phoneRepository.createPhone(clientEntity.id, phone);
        }

        await addressRepository.deleteAddressesByUserId(clientEntity.id);
        for (const addr of clientEntity.getAddressesDTO()) {
            await addressRepository.createAddress(clientEntity.id, addr);
        }

        return updatedClient;
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        return null;
    }
};


const UpdateCreditCardsUseCase = async (userId, cardData) => {


    const creditCards = cardData.card_number.map((num, i) => new CreditCard({
        card_number: num,
        holder_name: cardData.holder_name[i],
        expiration_date: cardData.expiration_date[i],
        is_default: cardData.is_default[i]
    }));


    for (const card of creditCards) {
        await creditCardRepository.updateCreditCard(
            userId,
            card.card_number,
            card.holder_name,
            card.expiration_date,
            card.is_default
        );
    }
};

const UpdateOrderStatusUseCase = async ({ orderId, statusId }) => {
    if (!orderId || !statusId) {
        throw new Error("Parâmetros obrigatórios ausentes.");
    }

    const updated = await orderRepository.updateOrderStatus(orderId, statusId);
    return updated;
};



module.exports = {
    CreateClientUseCase,
    UpdateOrderStatusUseCase,
    UpdateCreditCardsUseCase,
    updateClientUseCase,
    RegisterReturnUseCase,
    RegisterClientUseCase,
    GetOrdersByClientIdUseCase,
    DeleteClientUseCase
};
