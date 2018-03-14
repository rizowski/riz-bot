const bunyan = require('bunyan');

let log = bunyan.createLogger({ name: 'riz-bot' });

const logger = {
  log: log.info.bind(log),
  debug: log.debug.bind(log),
  warn: log.warn.bind(log),
  error: log.error.bind(log),
};

module.exports = logger;
