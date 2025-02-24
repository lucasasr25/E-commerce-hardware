const pool = require("../config/db");

const updateAddress = async (req, res) => {
    const { id } = req.params;
    const { street, number, complement, neighborhood, city, state, zip_code } = req.body;

    try {
        const result = await pool.query(
            `UPDATE addresses 
             SET street = COALESCE($1, street), 
                 number = COALESCE($2, number), 
                 complement = COALESCE($3, complement), 
                 neighborhood = COALESCE($4, neighborhood), 
                 city = COALESCE($5, city), 
                 state = COALESCE($6, state), 
                 zip_code = COALESCE($7, zip_code)
             WHERE id = $8 RETURNING *`,
            [street, number, complement, neighborhood, city, state, zip_code, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Address successfully updated", address: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { updateAddress };
