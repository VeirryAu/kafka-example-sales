// src/stress/stresstest.js
const autocannon = require("autocannon");

const url = process.env.STRESS_URL || "http://localhost:3000/sales";

function randomSale (i) {
  return JSON.stringify({
    product: `Coffee-${i % 10}`,
    quantity: Math.floor(Math.random() * 5) + 1,
    price: parseFloat((Math.random() * 10 + 1).toFixed(2))
  });
}

function run () {
  const connections = parseInt(process.env.STRESS_CONN || "50", 10); // concurrent connections
  const duration = parseInt(process.env.STRESS_DURATION || "20", 10); // seconds
  const pipelining = 1;

  const instance = autocannon({
    url,
    connections,
    duration,
    pipelining,
    method: "POST",
    headers: { "content-type": "application/json" },
    body: randomSale(1),
    setupClient: (client) => {
      // override body per request
      client.on('body', () => { });
    }
  });

  // Send different bodies from a simple loop (autocannon provides body static; for more complex scenario use artillery or write custom HTTP client)
  instance.on('tick', () => { });
  autocannon.track(instance, { renderProgressBar: true });
}

run();
