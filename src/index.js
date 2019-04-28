const config = require('config');
const { login, message, client, ready, debug, warn } = require('./clients/discord');
const commander = require('./commands');
const { errors } = require('./transformers/embeds');
const logger = require('./logger');
const redis = require('./controllers/cache');

const command = message.filter(
  (message) =>
    message.content.startsWith(config.token) &&
    !message.author.bot &&
    !message.author.lastMessage.system
);

ready.subscribe(() => {
  logger.info({
    config,
    message: 'Logged in',
    who: client.user.tag,
    guildCount: client.guilds.size,
    userCount: client.users.size,
  });
});

debug.subscribe(logger.debug);
warn.subscribe(logger.warn);

login.subscribe(() => {
  return command
    .throttleTime(750)
    .flatMap(async (message) => {
      const content = message.content.replace(config.token, '');

      try {
        await commander.doAction(content, client, message);
      } catch (error) {
        logger.error(error);
        const command = [{ name: 'command', value: `${config.token}${content}` }];
        const err = errors.general('Failed to run command', `I suck: ${error.message}`, command);

        await message.channel.send(err);
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
