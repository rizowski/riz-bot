const { merge } = require('rxjs/observable/merge');
const config = require('config');
const { login, message, client, ready, debug, warn } = require('./clients/discord');
const commander = require('./commands');
const { errors } = require('./transformers/embeds');
const logger = require('./logger');
const redis = require('./controllers/cache');
const { bacon, zack, jerran, aaron, rizowski } = require('./users');

const command = message.filter((message) => message.content.startsWith(config.token));

function byPerson(person) {
  return (msg) => msg.author.id === person;
}

function getUserStream(person) {
  return command.filter(byPerson(person)).throttleTime(750);
}

ready.subscribe(() => {
  logger.info({
    config,
    token: config.token,
    message: 'Logged in',
    who: client.user.tag,
    guildCount: client.guilds.size,
    userCount: client.users.size,
  });
});

debug.subscribe(logger.debug);
warn.subscribe(logger.warn);

login.subscribe(() => {
  return merge(
    getUserStream(rizowski.discordId),
    getUserStream(bacon.discordId),
    getUserStream(zack.discordId),
    getUserStream(jerran.discordId),
    getUserStream(aaron.discordId)
  )
    .flatMap(async (message) => {
      const content = message.content.replace(config.token, '');

      try {
        await commander.doAction(content, client, message);
      } catch (e) {
        logger.error(e);
        const command = [{ name: 'command', value: `${config.token}${content}` }];
        const err = errors.general('Failed to run command', `I suck: ${e.message}`, command);

        await message.channel.send(err);
      }

      const resCount = (await redis.get('response.count')) || 0;
      redis.set('response.count', resCount + 1);

      logger.info('Responding...', {
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
