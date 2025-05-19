class ReturnRequest {
    constructor({ user_id, order_id, product_id, quantity = 1 }) {
        this.user_id = user_id;
        this.order_id = order_id;
        this.product_id = product_id;
        this.quantity = quantity;
    }
}
