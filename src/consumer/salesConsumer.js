const kafka = require("../kafka");
const Sale = require("../models/Sale");

const consumer = kafka.consumer({ groupId: "sales-group" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "sales-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const sale = JSON.parse(message.value.toString());
      console.log("📥 Consumed sale:", sale);
      await Sale.create(sale);
    },
  });
})();
