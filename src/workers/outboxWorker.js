// src/workers/outboxWorker.js
const kafka = require("../kafka");
const Outbox = require("../models/Outbox");
const OutboxDLQ = require("../models/OutboxDLQ");
const { sequelize } = require("../db");

const producer = kafka.producer();

// configuration
const BATCH_SIZE = parseInt(process.env.OUTBOX_BATCH_SIZE || "20", 10);
const POLL_INTERVAL_MS = parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || "2000", 10);
const MAX_ATTEMPTS = parseInt(process.env.OUTBOX_MAX_ATTEMPTS || "5", 10);

async function start () {
  try {
    await producer.connect();
    console.log("Outbox worker connected to Kafka");
  } catch (e) {
    console.error("Failed to connect producer — will retry when sending", e);
  }

  setInterval(processBatch, POLL_INTERVAL_MS);
}

async function processBatch () {
  // Fetch a batch of PENDING outbox rows and attempt to claim them with a transaction
  const t = await sequelize.transaction();
  try {
    const rows = await Outbox.findAll({
      where: { status: "PENDING" },
      order: [["createdAt", "ASC"]],
      limit: BATCH_SIZE,
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    // mark as SENDING to avoid duplicated work from other workers
    const ids = rows.map(r => r.id);
    if (ids.length === 0) {
      await t.commit();
      return;
    }

    await Outbox.update({ status: "SENDING" }, { where: { id: ids }, transaction: t });
    await t.commit();

    // process each row outside transaction
    for (const row of rows) {
      await processRow(row).catch(err => {
        console.error("Error processing outbox row", row.id, err);
      });
    }
  } catch (err) {
    console.error("Error claiming outbox rows", err);
    try { await t.rollback(); } catch (e) { }
  }
}

async function processRow (row) {
  try {
    // publish to kafka
    await producer.send({
      topic: row.topic,
      messages: [{ key: row.key || null, value: JSON.stringify(row.payload) }]
    });

    // mark SENT
    await Outbox.update({ status: "SENT", attempts: row.attempts + 1 }, { where: { id: row.id } });
  } catch (err) {
    console.error("Failed to send outbox row", row.id, err);
    const attempts = row.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      // move to DLQ
      await OutboxDLQ.create({
        originalOutboxId: row.id,
        topic: row.topic,
        payload: row.payload,
        reason: (err && err.message) ? err.message : JSON.stringify(err)
      });

      await Outbox.destroy({ where: { id: row.id } }); // remove original
      console.warn(`Outbox row ${row.id} moved to DLQ after ${attempts} attempts`);
    } else {
      // mark BACK as PENDING with incremented attempts and lastError
      await Outbox.update({ status: "PENDING", attempts, lastError: (err && err.message) ? err.message : JSON.stringify(err) }, { where: { id: row.id } });
    }
  }
}

module.exports = { start };
