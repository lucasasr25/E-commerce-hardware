const pool = require("../config/db");

const createProduct = async (name, description, price) => {
    const result = await pool.query(
        "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *",
        [name, description, price]
    );
    return result.rows[0];
};

const getProducts = async () => {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
};

const getProductById = async (id) => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0];
};

const deleteProduct = async (id) => {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct
};
