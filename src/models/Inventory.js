const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Inventory = sequelize.define("Inventory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product: { type: DataTypes.STRING, allowNull: false },
  change: { type: DataTypes.INTEGER, allowNull: false }, // e.g. -2 for sale
  saleId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Inventory;
