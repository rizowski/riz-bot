import pino from 'pino';

const pinoLogger = pino({ messageKey: 'message' });
const logger = pinoLogger.child({ name: 'riz-bot' });

export default logger;
