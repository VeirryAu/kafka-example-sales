// src/routes/sales.js
const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const { sequelize } = require("../db");
const Outbox = require("../models/Outbox");

router.post("/", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { product, quantity, price } = req.body;

    // 1) create sale synchronously
    const sale = await Sale.create({ product, quantity, price }, { transaction: t });

    // 2) push inventory and accounting events to outbox (durable)
    const inventoryEvent = {
      product,
      change: -quantity,
      saleId: sale.id
    };

    const accountingEvent = {
      saleId: sale.id,
      amount: quantity * price,
      entryType: "REVENUE"
    };

    await Outbox.create({
      topic: "inventory-topic",
      payload: inventoryEvent
    }, { transaction: t });

    await Outbox.create({
      topic: "accounting-topic",
      payload: accountingEvent
    }, { transaction: t });

    // commit db transaction -> sale + outbox rows are durable
    await t.commit();

    res.status(201).json({
      invoice: {
        id: sale.id,
        product: sale.product,
        quantity: sale.quantity,
        price: sale.price,
        total: sale.quantity * sale.price
      }
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to create sale" });
  }
});

module.exports = router;
