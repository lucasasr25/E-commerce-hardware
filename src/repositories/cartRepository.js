const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Criar ou obter carrinho ativo do usuário
const getOrCreateCart = async (userId) => {
    const client = await pool.connect();
    try {
        let result = await client.query(
            `SELECT * FROM customer_carts WHERE user_id = $1 LIMIT 1`, 
            [userId]
        );

        if (result.rowCount === 0) {
            result = await client.query(
                `INSERT INTO customer_carts (user_id) VALUES ($1) RETURNING *`, 
                [userId]
            );
        }

        return result.rows[0]; 
    } finally {
        client.release();
    }
};


const updateCartItemQuantity = async (userId, productId, quantity) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const cart = await getOrCreateCart(userId);

        const existingItem = await client.query(
            `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cart.id, productId]
        );

        if (existingItem.rowCount === 0) {
            throw new Error("Item não encontrado no carrinho.");
        }

        if (quantity > 0) {
            // Atualiza para a quantidade enviada
            await client.query(
                `UPDATE cart_items 
                 SET quantity = $1 
                 WHERE cart_id = $2 AND product_id = $3`,
                [quantity, cart.id, productId]
            );
        } else {
            // Se quantidade <= 0, remove o item do carrinho
            await client.query(
                `DELETE FROM cart_items 
                 WHERE cart_id = $1 AND product_id = $2`,
                [cart.id, productId]
            );
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};



// Adicionar item ao carrinho
const addItemToCart = async (userId, productId, quantity) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const cart = await getOrCreateCart(userId);

        // Verifica se o item já existe no carrinho
        const existingItem = await client.query(
            `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cart.id, productId]
        );

        if (existingItem.rowCount > 0) {
            // Atualiza a quantidade
            await client.query(
                `UPDATE cart_items 
                 SET quantity = quantity + $1 
                 WHERE cart_id = $2 AND product_id = $3`,
                [quantity, cart.id, productId]
            );
        } else {
            // Adiciona um novo item
            await client.query(
                `INSERT INTO cart_items (cart_id, product_id, quantity) 
                 VALUES ($1, $2, $3)`,
                [cart.id, productId, quantity]
            );
        }

        await client.query("COMMIT");
        return { message: "Item adicionado ao carrinho!" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

// Listar itens do carrinho
const getCartItems = async (userId) => {
    const result = await pool.query(
        `SELECT ci.id, ci.product_id, p.price, p.name, ci.quantity
         FROM cart_items ci
         INNER JOIN customer_carts c ON ci.cart_id = c.id
         INNER JOIN products p ON ci.product_id = p.id
         WHERE c.user_id = $1`,
        [userId]
    );
    return result.rows;
};

const getCartTotal = async (userId) => {
    const result = await pool.query(
        `SELECT 
            COALESCE(SUM(p.price * ci.quantity), 0) AS total
         FROM cart_items ci
         INNER JOIN customer_carts c ON ci.cart_id = c.id
         INNER JOIN products p ON ci.product_id = p.id
         WHERE c.user_id = $1`,
        [userId]
    );
    return result.rows[0].total;
};


// Remover item do carrinho
const removeItemFromCart = async (userId, productId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const cart = await getOrCreateCart(userId);

        await client.query(
            `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cart.id, productId]
        );

        await client.query("COMMIT");
        return { message: "Item removido do carrinho!" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

// Limpar o carrinho do usuário
const clearCart = async (userId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const cart = await getOrCreateCart(userId);

        await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);

        await client.query("COMMIT");
        return { message: "Carrinho limpo!" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { getOrCreateCart, updateCartItemQuantity, addItemToCart, getCartItems, removeItemFromCart, clearCart, getCartTotal };
