import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Custom log levels
const levels = {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    http: 4,
    debug: 5,
};

winston.addColors({
    error: "red",
    warn: "yellow",
    success: "green",
    info: "cyan",
    http: "magenta",
    debug: "blue",
});

// Dynamic log level
const level = () => {
    const env = process.env.NODE_ENV || "development";
    return env === "development" ? "debug" : "warn";
};

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console log format
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : "";
        return `${timestamp} [${level}] : ${message}${metaStr}`;
    })
);

// Winston Logger
const logger = winston.createLogger({
    level: level(),
    levels,
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: path.join(logsDir, "application-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            level: "debug",
        }),
        new DailyRotateFile({
            filename: path.join(logsDir, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "30d",
            level: "error",
        }),
        new DailyRotateFile({
            filename: path.join(logsDir, "http-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "7d",
            level: "http",
        }),
        new winston.transports.Console({
            format: consoleFormat,
        }),
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join(logsDir, "exceptions-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
        }),
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: path.join(logsDir, "rejections-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
        }),
    ],


});



export default logger;
