const kafka = require("../kafka");
const Accounting = require("../models/Accounting");

const consumer = kafka.consumer({ groupId: "accounting-group" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "accounting-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log("📥 Accounting event:", event);
      await Accounting.create(event);
    },
  });
})();
