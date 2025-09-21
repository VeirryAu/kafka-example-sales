// src/models/ConsumerDLQ.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const ConsumerDLQ = sequelize.define("ConsumerDLQ", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  topic: { type: DataTypes.STRING, allowNull: false },
  payload: { type: DataTypes.JSON, allowNull: false },
  consumer: { type: DataTypes.STRING, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: "consumer_dlq",
  timestamps: true
});

module.exports = ConsumerDLQ;
