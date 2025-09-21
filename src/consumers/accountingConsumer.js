const kafka = require("../kafka");
const Accounting = require("../models/Accounting");
const ConsumerDLQ = require("../models/ConsumerDLQ");

const consumer = kafka.consumer({ groupId: "accounting-group" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "accounting-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      try {
        console.log("📥 Accounting event:", event);
        await Accounting.create(event);
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
