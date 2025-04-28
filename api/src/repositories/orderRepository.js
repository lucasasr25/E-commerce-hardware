const pool = require("../config/db");

const createOrderStatus = async (statusName) => {
    const result = await pool.query(
        "INSERT INTO order_status (status_name) VALUES ($1) RETURNING *",
        [statusName]
    );
    return result.rows[0];
};

const deleteOrderStatus = async (id) => {
    const result = await pool.query(
        "DELETE FROM order_status WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

const getAllOrderStatus = async () => {
    const result = await pool.query("SELECT * FROM order_status ORDER BY id ASC");
    return result.rows;
};

const createOrder = async (userId, tradeCouponId, promotionalCouponId, addressId, statusId, subTotal, totalPrice, items) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Inicia uma transação

        // Insere o pedido na tabela 'orders'
        const orderQuery = `
            INSERT INTO orders (user_id, trade_coupon_id, promotional_coupon_id, address_id, status_id, sub_total, total_price)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
        `;
        const orderResult = await client.query(orderQuery, [userId, tradeCouponId, promotionalCouponId, addressId, statusId, subTotal, totalPrice]);

        const orderId = orderResult.rows[0].id;

        // Insere os itens do pedido na tabela 'order_items'
        const orderItemsQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES ($1, $2, $3, $4);
        `;
        for (const item of items) {
            await client.query(orderItemsQuery, [orderId, item.product_id, item.quantity, item.price]);
        }

        await client.query('COMMIT'); // Confirma a transação

        return orderId; // Retorna o ID do pedido criado
    } catch (error) {
        await client.query('ROLLBACK'); // Desfaz a transação em caso de erro
        console.error('Erro ao criar pedido:', error);
        throw error;
    } finally {
        client.release(); // Libera o cliente para o pool
    }
};

const getAllOrders = async (userId) => {
    const result = await pool.query(`
        SELECT o.id, o.created_at, o.status_id, o.sub_total, o.total_price, os.status_name
        FROM orders o
        JOIN order_status os ON o.status_id = os.id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC
    `, [userId]);

    const orders = result.rows;

    // Para cada pedido, buscamos os itens
    for (let order of orders) {
        const itemsResult = await pool.query(`
            SELECT oi.product_id, oi.quantity, oi.price, p.name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `, [order.id]);

        order.items = itemsResult.rows;
    }

    return orders;
};




module.exports = {
    createOrderStatus,
    deleteOrderStatus,
    getAllOrderStatus,
    createOrder,
    getAllOrders
};
