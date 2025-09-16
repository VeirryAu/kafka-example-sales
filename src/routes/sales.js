const express = require("express");
const router = express.Router();
const { produceSale } = require("../producers/salesProducer");

router.post("/", async (req, res) => {
  try {
    const { product, quantity, price } = req.body;
    await produceSale({ product, quantity, price });
    res.status(200).json({ status: "queued", data: { product, quantity, price } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to queue sale" });
  }
});

module.exports = router;
