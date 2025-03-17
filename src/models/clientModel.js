const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Client = sequelize.define('Client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    document: { type: DataTypes.STRING(14), unique: true, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Client;