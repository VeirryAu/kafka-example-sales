const kafka = require("../kafka");
const producer = kafka.producer();

async function produceAccountingEvent (event) {
  await producer.connect();
  await producer.send({
    topic: "accounting-topic",
    messages: [{ value: JSON.stringify(event) }],
  });
}

module.exports = { produceAccountingEvent };
