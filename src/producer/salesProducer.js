const kafka = require("../kafka");

const producer = kafka.producer();

async function produceSale (sale) {
  await producer.connect();
  await producer.send({
    topic: "sales-topic",
    messages: [{ value: JSON.stringify(sale) }],
  });
}

module.exports = { produceSale };
