const kafka = require("../kafka");
const OutboxDLQ = require("../models/OutboxDLQ");
const { sequelize } = require("../db");

const producer = kafka.producer();

// configuration
const DLQ_BATCH_SIZE = parseInt(process.env.DLQ_BATCH_SIZE || "10", 10);
const DLQ_POLL_INTERVAL_MS = parseInt(process.env.DLQ_POLL_INTERVAL_MS || "10000", 10);
const DLQ_MAX_ATTEMPTS = parseInt(process.env.DLQ_MAX_ATTEMPTS || "5", 10);

async function start () {
  try {
    await producer.connect();
    console.log("DLQ worker connected to Kafka");
  } catch (e) {
    console.error("Failed to connect DLQ producer — will retry when sending", e);
  }

  setInterval(processBatch, DLQ_POLL_INTERVAL_MS);
}

async function processBatch () {
  const t = await sequelize.transaction();
  try {
    const rows = await OutboxDLQ.findAll({
      where: { status: "PENDING" },
      order: [["createdAt", "ASC"]],
      limit: DLQ_BATCH_SIZE,
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (rows.length === 0) {
      await t.commit();
      return;
    }

    for (const row of rows) {
      await processRow(row, t).catch(err => {
        console.error("Error reprocessing DLQ row", row.id, err);
      });
    }

    await t.commit();
  } catch (err) {
    console.error("Error claiming DLQ rows", err);
    try { await t.rollback(); } catch (e) { }
  }
}

async function processRow (row, trans) {
  try {
    await producer.send({
      topic: row.topic,
      messages: [{ key: String(row.originalOutboxId), value: JSON.stringify(row.payload) }]
    });

    await OutboxDLQ.update(
      { status: "SENT", attempts: row.attempts + 1 },
      { where: { id: row.id }, transaction: trans }
    );

    console.log(`✅ DLQ row ${row.id} successfully resent`);
  } catch (err) {
    console.error("Failed to resend DLQ row", row.id, err);
    const attempts = row.attempts + 1;

    await OutboxDLQ.update(
      {
        attempts,
        status: attempts >= DLQ_MAX_ATTEMPTS ? "FAILED" : "PENDING",
        lastError: err.message || JSON.stringify(err)
      },
      { where: { id: row.id }, transaction: trans }
    );
  }
}

module.exports = { start };
