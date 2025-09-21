// src/models/Outbox.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Outbox = sequelize.define("Outbox", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  topic: { type: DataTypes.STRING, allowNull: false },
  key: { type: DataTypes.STRING, allowNull: true },
  payload: { type: DataTypes.JSON, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "PENDING" }, // PENDING, SENDING, SENT, FAILED
  attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  lastError: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: "outbox",
  timestamps: true
});

module.exports = Outbox;
