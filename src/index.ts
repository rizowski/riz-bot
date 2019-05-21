import config from 'config';
import { login, message, client, ready, debug, warn } from './clients/discord';
import * as commander from './commands';
import logger from './logger';
import redis from './controllers/cache';
import { connectDb } from './controllers/db';
import { GeneralError } from './errors';

const command = message.filter(
  (message) =>
    message.content.startsWith(config.token) &&
    !message.author.bot &&
    !message.author.lastMessage.system
);

ready.subscribe(() => {
  logger.info({
    message: 'Logged in',
    who: client.user.tag,
    guildCount: client.guilds.size,
    userCount: client.users.size,
  });
});

debug.subscribe(logger.debug);
warn.subscribe(logger.warn);

login.subscribe(async () => {
  await connectDb();

  return command
    .throttleTime(750)
    .flatMap(async (message) => {
      const content = message.content.replace(config.token, '');

      try {
        await commander.doAction(content, client, message);
      } catch (error) {
        logger.error(error);

        const err = new GeneralError({
          title: 'Failed to run command',
          reason: `I suck: ${error.message}`,
          details: [{ title: 'command', description: `${config.token}${content}` }],
        });

        await message.channel.send(err.serialize());
      }

      const resCount = (await redis.get('response.count')) || 0;
      redis.set('response.count', resCount + 1);

      logger.info({
        message: 'Action completed.',
        command: content,
        username: message.author.username,
        discriminator: message.author.discriminator,
        channel: message.channel.name || 'direct',
      });

      return message;
    })
    .subscribe(
      () => {},
      (e) => {
        logger.error('Unexpected Error', { error: e.message, stack: e.stack });
      },
      () => logger.info('Done')
    );
});

process.on('unhandledRejection', (error) => {
  logger.error(error);
});
