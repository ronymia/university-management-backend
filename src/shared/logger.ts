import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, label, printf } = format;

// Format for log entries
const loggerFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${date.toDateString()} ${hours}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
});

// ✅ Writable log directory for serverless environments
// const baseLogPath = path.join('/tmp', 'logs', 'winston');
const baseLogPath = path.join(process.cwd(), 'logs', 'winston');

// Ensure log subdirectories exist
['successes', 'errors'].forEach((dir) => {
  const fullPath = path.join(baseLogPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Info logger
const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'UMS Api Getaway' }), timestamp(), loggerFormat),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      level: 'info',
      filename: path.join(baseLogPath, 'successes', '%DATE%success.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '1d'
    })
  ]
});

// Error logger
const errorLogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'UMS Api Getaway' }), timestamp(), loggerFormat),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      level: 'error',
      filename: path.join(baseLogPath, 'errors', '%DATE%error.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '1d'
    })
  ]
});

export { logger, errorLogger };
