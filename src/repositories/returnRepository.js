const pool = require("../config/db");

const createReturn = async ({ user_id, order_id, product_id, quantity }) => {
    const query = `
        INSERT INTO returns (user_id, order_id, product_id, quantity, return_status_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [
        user_id,
        order_id,
        product_id,
        quantity,
        2 // status inicial (Ex: "Solicitado", "Em análise" etc. -> ID 1)
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getReturnsByUserId = async (userId) => {
    const query = `
        SELECT r.*, 
               p.name AS product_name,
               rs.name AS status_name,
               rs.description AS status_description,
               o.id AS order_id,
               o.created_at AS order_date,
               o.total_price AS order_total,
               os.status_name AS order_status
        FROM returns r
        JOIN products p ON r.product_id = p.id
        JOIN return_statuses rs ON r.return_status_id = rs.id
        JOIN orders o ON r.order_id = o.id
        JOIN order_status os ON o.status_id = os.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC;
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows;
};

module.exports = {
    createReturn,
    getReturnsByUserId
};
