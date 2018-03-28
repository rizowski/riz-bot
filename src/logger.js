const bunyan = require('bunyan');

let log = bunyan.createLogger({ name: 'riz-bot' });

const logger = {
  trace: log.trace.bind(log),
  log: log.info.bind(log),
  debug: log.debug.bind(log),
  warn: log.warn.bind(log),
  error: log.error.bind(log),
};

module.exports = logger;
