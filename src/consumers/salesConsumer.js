const kafka = require("../kafka");
const Sale = require("../models/Sale");
const ConsumerDLQ = require("../models/ConsumerDLQ")

const consumer = kafka.consumer({ groupId: "sales-group" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "sales-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      try {
        console.log("📥 Consumed sale:", event);
        await Sale.create(event);
      } catch (err) {
        console.error("Processing failed:", err);
        await ConsumerDLQ.create({
          topic: "inventory-topic",
          payload: event,
          consumer: "inventoryConsumer",
          reason: err.message
        });
      }
    },
  });
})();
