const pool = require("../config/db");

const getStatusID = async (statusName) => {
    const result = await pool.query(
        "SELECT id FROM order_status WHERE status_name = $1",
        [statusName]
    );
    return result.rows[0];
};

module.exports = {
    getStatusID,
}