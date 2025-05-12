const pool = require('../db'); // A conexão com o banco de dados

/**
 * Cria um log de transação de forma genérica.
 * @param {Object} params - Parâmetros para criar o log.
 * @param {number} params.user_id - ID do usuário.
 * @param {string} params.operation_type - Tipo de operação (ex: "create_order", "stock_decrease").
 * @param {string} params.table_name - Nome da tabela afetada (ex: "orders", "stock").
 * @param {string} params.register_id - ID do registro afetado.
 * @param {Object} params.old_data - Dados antes da alteração (opcional).
 * @param {Object} params.new_data - Dados após a alteração (opcional).
 */
const createTransactionLog = async ({ user_id, operation_type, table_name, register_id, old_data = null, new_data = null }) => {
    const query = `
        INSERT INTO transaction_logs (user_id, operation_type, table_name, register_id, old_data, new_data)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [user_id, operation_type, table_name, register_id, JSON.stringify(old_data), JSON.stringify(new_data)];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = {
    createTransactionLog
};
