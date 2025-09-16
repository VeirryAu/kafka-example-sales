const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "salesdb",
  process.env.DB_USER || "salesuser",
  process.env.DB_PASS || "salespass",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mariadb",
    logging: false,
  }
);

module.exports = { sequelize };
