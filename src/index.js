const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./db");

// Import all models so Sequelize knows them
require("./models/Sale");
require("./models/Inventory");
require("./models/Accounting");

// Consumers (async workers)
require("./consumers/inventoryConsumer");
require("./consumers/accountingConsumer");

const salesRoutes = require("./routes/sales");

const app = express();
app.use(bodyParser.json());
app.use("/sales", salesRoutes);

const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced with models");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
