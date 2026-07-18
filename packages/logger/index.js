import pino from 'pino';

const { STAGE } = process.env;

export function createConfig(stage = STAGE) {
  const baseConfig = {
    name: 'riz-bot',
    messageKey: 'message',
    redact: [],
    level: 'info',
  };

  if (stage === 'local') {
    return {
      ...baseConfig,
      level: 'trace',
      transport: {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname',
        },
      },
    };
  }

  if (stage === 'test') {
    return {
      ...baseConfig,
      level: 'silent',
    };
  }

  return baseConfig;
}

const logger = pino(createConfig());

export default logger;
