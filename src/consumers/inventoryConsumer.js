const kafka = require("../kafka");
const Inventory = require("../models/Inventory");
const ConsumerDLQ = require("../models/ConsumerDLQ");

const consumer = kafka.consumer({ groupId: "inventory-group" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "inventory-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      try {
        console.log("📥 Inventory event:", event);
        await Inventory.create(event);
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
