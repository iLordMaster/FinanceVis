const winston = require("winston");
const LokiTransport = require("winston-loki");

const logger = winston.createLogger({
  level: "info", // captures info, warn, error (change to "debug" if needed)
  format: winston.format.json(),
  transports: [
    new LokiTransport({
      host: process.env.LOKI_URL, // e.g. http://loki:3100
      labels: {
        app: "financevis",
        env: process.env.NODE_ENV || "development",
      },
      json: true,
      interval: 5,
      replaceTimestamp: true,
    }),

    // Optional but recommended (local debugging)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      ),
    }),
  ],
});

module.exports = logger;
