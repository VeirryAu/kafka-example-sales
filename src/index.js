const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./db");
const salesRoutes = require("./routes/sales");
require("./consumers/salesConsumer"); // start consumer

const app = express();
app.use(bodyParser.json());

// routes
app.use("/sales", salesRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
