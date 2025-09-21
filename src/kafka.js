const { Kafka } = require("kafkajs");


console.log('process.env.KAFKA_BROKER', process.env.KAFKA_BROKER)

const kafka = new Kafka({
  clientId: "sales-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

module.exports = kafka;
