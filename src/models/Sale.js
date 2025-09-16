const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Sale = sequelize.define("Sale", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Sale;
