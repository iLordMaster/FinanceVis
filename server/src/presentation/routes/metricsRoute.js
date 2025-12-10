const client = require("prom-client");
const express = require("express");
const router = express.Router();

// Collect default Node.js metrics
client.collectDefaultMetrics();

// Metrics endpoint
router.get("/", async (_, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = router;
