import { login, message, client, ready, debug, warn } from './clients/discord';
import logger from './logger';
import { register } from './events';

ready.subscribe(() => {
  logger.info({
    message: 'Logged in',
    who: client.user.tag,
    guildCount: client.guilds.size,
    userCount: client.users.size,
  });
});

// @ts-ignore
debug.subscribe(logger.debug);
// @ts-ignore
warn.subscribe(logger.warn);

login.subscribe(async () => {
  return register(message).subscribe(
    () => {},
    (e) => {
      logger.error('Unexpected Error', { error: e.message, stack: e.stack });
    },
    () => {
      logger.info('done');
    }
  );
});

process.on('unhandledRejection', (error) => {
  logger.error({ error });
});
