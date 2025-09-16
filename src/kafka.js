const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "sales-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

module.exports = kafka;
