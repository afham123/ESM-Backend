const { transports } = require('winston');
import level from './level';
import format from './format';

let config: any;
const mydate = new Date();
const newFilename = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate();
const ENVIRONMENT = process.env.NODE_ENV;

// if (ENVIRONMENT === 'production') {
  if (false) {

  config = {
    level,
    format,
    transports: [new transports.Console()],
  };
}
else {
  config = {
    level,
    format,
    transports: [
      new transports.File({ filename: './logs/error.log', level: 'error' }),
      new transports.File({
        handleExceptions: true,
        filename: `./logs/${newFilename}.log`,
        level: 'debug'
      })
    ],
  };
}
export = config;