const kafka = require("../kafka");
const producer = kafka.producer();

async function produceInventoryEvent (event) {
  await producer.connect();
  await producer.send({
    topic: "inventory-topic",
    messages: [{ value: JSON.stringify(event) }],
  });
}

module.exports = { produceInventoryEvent };
