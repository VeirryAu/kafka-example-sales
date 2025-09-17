const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const { produceInventoryEvent } = require("../producers/inventoryProducer");
const { produceAccountingEvent } = require("../producers/accountingProducer");

router.post("/", async (req, res) => {
  try {
    const { product, quantity, price } = req.body;

    // 1️⃣ Sync insert into Sales (must return invoice)
    const sale = await Sale.create({ product, quantity, price });

    // 2️⃣ Async events
    await produceInventoryEvent({
      product,
      change: -quantity,
      saleId: sale.id
    });

    await produceAccountingEvent({
      saleId: sale.id,
      amount: quantity * price,
      entryType: "REVENUE"
    });

    // 3️⃣ Return invoice data immediately
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
    console.error(error);
    res.status(500).json({ error: "Failed to create sale" });
  }
});

module.exports = router;
