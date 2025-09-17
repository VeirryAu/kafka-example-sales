const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Accounting = sequelize.define("Accounting", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  saleId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  entryType: { type: DataTypes.STRING, allowNull: false } // e.g. "REVENUE"
});

module.exports = Accounting;
