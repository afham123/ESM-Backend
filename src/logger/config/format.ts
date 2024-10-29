import moment from "moment-timezone";
const { format: { printf, timestamp, combine, colorize } } = require('winston');

const logFormat = printf(
  ({ level, message, timestamp: ts }: any) => `${moment(new Date()).tz("Asia/Kolkata").format("DD-MMM HH:mm:ss.SSS")} [${level.slice(0, 3).toUpperCase()}]: ${message}`,
);

export = combine(timestamp(), logFormat);