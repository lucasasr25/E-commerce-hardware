const IGenericRepository = require('./interfaces/IGenericRepository');
const pool = require('../config/db');
const Coupon = require('../entities/Coupon');
const TradeCoupon = require('../entities/TradeCoupon');

class CouponRepository extends IGenericRepository {
    async createCoupon(code, discountPercentage, expirationDate) {
        const result = await pool.query(
            'INSERT INTO promotional_coupons (code, discount_percentage, expiration_date) VALUES ($1, $2, $3) RETURNING *',
            [code, discountPercentage, expirationDate]
        );
        return result.rows[0];
    }

    async deleteCoupon(id) {
        const result = await pool.query(
            'DELETE FROM promotional_coupons WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }

    async getAllCoupons() {
        const result = await pool.query('SELECT * FROM promotional_coupons ORDER BY expiration_date DESC');
        return result.rows;
    }

    async getCoupon(code) {
        const result = await pool.query(
            'SELECT * FROM promotional_coupons WHERE code = $1',
            [code]
        );
        return result.rows[0];
    }

    async getTradeCoupon(code) {
        const result = await pool.query(
            'SELECT * FROM trade_coupons WHERE code = $1',
            [code]
        );
        return result.rows[0];
    }

    async createTradeCoupon(coupon) {
        const result = await pool.query(
            'INSERT INTO trade_coupons (user_id, code, value) VALUES ($1, $2, $3) RETURNING *',
            [coupon.userId, coupon.code, coupon.value]
        );
        console.log(result.rows[0]);
        return result.rows[0];
    }

    async deleteTradeCoupon(id) {
        const result = await pool.query(
            'DELETE FROM trade_coupons WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }

    async getAllTradeCoupons() {
        const result = await pool.query('SELECT * FROM trade_coupons ORDER BY created_at DESC');
        return result.rows;
    }

    async getTradeCouponByCode(code) {
        const result = await pool.query(
            'SELECT * FROM trade_coupons WHERE code = $1',
            [code]
        );
        return result.rows[0];
    }
}

module.exports = CouponRepository;
