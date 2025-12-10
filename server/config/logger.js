const winston = require("winston");
const LokiTransport = require("winston-loki");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    app: "financevis",
    env: process.env.NODE_ENV || "development",
  },
  transports: [
    new LokiTransport({
      host: process.env.LOKI_URL,
      json: true,
      interval: 5,
      labels: {
        app: "financevis",
        env: process.env.NODE_ENV || "development",
      },
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ""
            }`
        )
      ),
    }),
  ],
});

module.exports = logger;
