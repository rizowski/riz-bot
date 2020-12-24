const pino = require('pino');

const { STAGE } = process.env;

function createConfig() {
  const baseConfig = {
    name: 'riz-bot',
    messageKey: 'message',
    redact: [],
    level: 'info',
  };

  if (['local'].includes(STAGE)) {
    return {
      ...baseConfig,
      level: 'trace',
      prettyPrint: {
        ignore: 'pid,hostname',
      },
    };
  }

  if (STAGE === 'test') {
    return {
      ...baseConfig,
      level: 'silent',
    };
  }

  return baseConfig;
}

const logger = pino(createConfig());

module.exports = logger;
