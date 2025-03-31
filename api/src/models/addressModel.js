const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user"); // Importa o modelo de usuário

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE", // Remove os endereços se o usuário for deletado
    },
    adr_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nick: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2), // Exemplo: 'SP', 'RJ'
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Brasil",
    },
    zipcode: {
      type: DataTypes.STRING(10), // Para aceitar CEPs como '12345-678'
      allowNull: false,
      validate: {
        is: /^[0-9]{5}-?[0-9]{3}$/, // Validação para CEP brasileiro
      },
    },
  },
  {
    tableName: "addresses",
    underscored: true,
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Define o relacionamento com User
Address.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = Address;
