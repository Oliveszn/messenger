import winston from "winston";

export const logger = winston.createLogger({
  //   level: process.env.NODE_ENV === "production" ? "info" : "debug",
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    // winston.format.errors({ stack: true }),
    // winston.format.splat(),
    // winston.format.json(),
    winston.format.printf((info) => {
      return `${info.timestamp} -> [${info.level.toUpperCase()} ${info.message}]`;
    }),
  ),

  //   transports: [
  //     new winston.transports.Console({
  //       format: winston.format.combine(
  //         winston.format.colorize(),
  //         winston.format.simple(),
  //       ),
  //     }),
  //     new winston.transports.File({ filename: "error.log", level: "error" }),
  //     new winston.transports.File({ filename: "combined.log" }),
  //   ],
  transports: [new winston.transports.Console()],
});
