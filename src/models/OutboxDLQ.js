// src/models/OutboxDLQ.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const OutboxDLQ = sequelize.define("OutboxDLQ", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  originalOutboxId: { type: DataTypes.BIGINT, allowNull: true },
  topic: { type: DataTypes.STRING, allowNull: false },
  payload: { type: DataTypes.JSON, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: "outbox_dlq",
  timestamps: true
});

module.exports = OutboxDLQ;
