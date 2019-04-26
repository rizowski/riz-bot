const pino = require('pino');

const pinoLogger = pino({ messageKey: 'message' });
const logger = pinoLogger.child({ name: 'riz-bot' });

module.exports = logger;
