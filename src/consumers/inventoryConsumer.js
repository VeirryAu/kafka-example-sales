const kafka = require("../kafka");
const Inventory = require("../models/Inventory");

const consumer = kafka.consumer({ groupId: "inventory-group" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "inventory-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log("📥 Inventory event:", event);
      await Inventory.create(event);
    },
  });
})();
