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

const getOrderById = async (id) => {
    const result = await pool.query(`
        SELECT * FROM orders
        WHERE id = $1
    `, [id]);
    return result.rows[0];
};

const getItemsByOrderId = async (id) => {
    const result = await pool.query(`
SELECT p.*, pd.*, order_items.* FROM products p INNER JOIN product_details pd ON p.id = pd.product_id INNER JOIN order_items on order_items.product_id = p.id WHERE order_items.order_id = $1;
    `, [id]);
    return result.rows;
};

const createOrderWithCards = async (
    userId,
    tradeCouponId,
    promotionalCouponId,
    addressId,
    statusId,
    subTotal,
    totalPrice,
    items,
    cartoes
) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const orderResult = await client.query(`
            INSERT INTO orders (user_id, trade_coupon_id, promotional_coupon_id, address_id, status_id, sub_total, total_price, ship_value)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
        `, [userId, tradeCouponId, promotionalCouponId, addressId, statusId, subTotal, totalPrice, 50]);

        const orderId = orderResult.rows[0].id;

        for (const item of items) {
            await client.query(`
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4);
            `, [orderId, item.product_id, item.quantity, item.price]);
        }

        const paymentResult = await client.query(`
            INSERT INTO payments (order_id, payment_type, status_id)
            VALUES ($1, $2, $3) RETURNING id;
        `, [orderId, 'credit_card', statusId]); // ou outro valor em 'payment_type'
        
        const paymentId = paymentResult.rows[0].id;

        for (const cartao of cartoes) {
            const cartaoData = await client.query(`
                SELECT holder_name, card_number, expiration_date
                FROM credit_cards
                WHERE id = $1 AND user_id = $2;
            `, [cartao.id, userId]);

            if (!cartaoData.rowCount) throw new Error("Cartão inválido para o usuário.");

            const c = cartaoData.rows[0];
            const last4 = c.card_number.slice(-4);
            const [mes, ano] = c.expiration_date.split("/");

            await client.query(`
                INSERT INTO payment_cards (payment_id, card_brand, last_four_digits, cardholder_name, expiration_month, expiration_year, card_token, amount)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `, [
                paymentId,             // payment_id → orderId funciona se você não usa uma tabela separada de "payments"
                'N/A',               // ou 'VISA', etc. Se você tiver essa info
                last4,
                c.holder_name,
                parseInt(mes),
                parseInt("20" + ano),
                'dummy_token',
                cartao.valor
            ]);
        }

        await client.query('COMMIT');
        return orderId;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar pedido:', error);
        throw error;
    } finally {
        client.release();
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


const getOrdersByClientId = async (clientId) => {
    const query = `
        SELECT o.*, 
               os.status_name,
               a.street || ', ' || a.number || ' - ' || a.city AS full_address
        FROM orders o
        JOIN order_status os ON o.status_id = os.id
        LEFT JOIN addresses a ON o.address_id = a.id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC;
    `;
    const { rows } = await pool.query(query, [clientId]);
    return rows;
};

const updateOrderStatus = async (orderId, statusId) => {
    const query = `UPDATE orders SET status_id = $1 WHERE id = $2`;
    await pool.query(query, [statusId, orderId]);
};




module.exports = {
    createOrderStatus,
    deleteOrderStatus,
    getAllOrderStatus,
    updateOrderStatus,
    createOrder,
    getAllOrders,
    getOrderById,
    getItemsByOrderId,
    getOrdersByClientId,
    createOrderWithCards
};
