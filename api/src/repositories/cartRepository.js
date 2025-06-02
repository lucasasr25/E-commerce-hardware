const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const IGenericRepository = require('./interfaces/IGenericRepository');

class CartRepository extends IGenericRepository {
  // Criar ou obter carrinho ativo do usuário
  async getOrCreateCart(userId) {
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
  }

  async saveCart(cart) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Usando this para chamar o método da classe
      const dbCart = await this.getOrCreateCart(cart.userId);
      const cartId = dbCart.id;

      await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);

      for (const item of cart.items) {
        await client.query(
          `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
          [cartId, item.productId, item.quantity]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateCartItemQuantity(userId, productId, quantity) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const cart = await this.getOrCreateCart(userId);

      const existingItem = await client.query(
        `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
        [cart.id, productId]
      );

      if (existingItem.rowCount === 0) {
        throw new Error("Item não encontrado no carrinho.");
      }

      if (quantity > 0) {
        await client.query(
          `UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3`,
          [quantity, cart.id, productId]
        );
      } else {
        await client.query(
          `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
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
  }

  async addItemToCart(userId, productId, quantity) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const cart = await this.getOrCreateCart(userId);

      const existingItem = await client.query(
        `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
        [cart.id, productId]
      );

      if (existingItem.rowCount > 0) {
        await client.query(
          `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3`,
          [quantity, cart.id, productId]
        );
      } else {
        await client.query(
          `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
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
  }

  async getCartItems(userId) {
    const result = await pool.query(
      `SELECT ci.id, ci.product_id, p.price, p.name, ci.quantity
       FROM cart_items ci
       INNER JOIN customer_carts c ON ci.cart_id = c.id
       INNER JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  async getCartTotal(userId) {
    const result = await pool.query(
      `SELECT COALESCE(SUM(p.price * ci.quantity), 0) AS total
       FROM cart_items ci
       INNER JOIN customer_carts c ON ci.cart_id = c.id
       INNER JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    return result.rows[0].total;
  }

  async removeItemFromCart(userId, productId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const cart = await this.getOrCreateCart(userId);

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
  }

  async clearCart(userId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const cart = await this.getOrCreateCart(userId);

      await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);

      await client.query("COMMIT");
      return { message: "Carrinho limpo!" };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = CartRepository;
