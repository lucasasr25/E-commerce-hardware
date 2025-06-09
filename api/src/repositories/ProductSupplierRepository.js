const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require('../config/db');

class ProductSupplierRepository extends IGenericRepository {


  async getByTaxId(taxId) {
    const result = await pool.query(
      "SELECT * FROM product_supplier WHERE tax_id = $1;",
      [taxId]
    );
    return result.rows[0];
  }
}

module.exports = ProductSupplierRepository;
