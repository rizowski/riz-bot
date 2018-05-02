const { merge } = require('rxjs/observable/merge');
const { message, client } = require('./discord');
const commander = require('./commands');
const { errors } = require('./transformers/embeds');
const logger = require('./logger');
const { bacon, zack, jerran, aaron, rizowski } = require('./users');
const token = '!';

const command = message.filter((message) => message.content.startsWith(token));

function byPerson(person){
  return (msg) => (msg.author.id === person);
}

function getUserStream(person) {
  return command.filter(byPerson(person))
    .throttleTime(1000);
}

merge(
  getUserStream(bacon.discordId),
  getUserStream(zack.discordId),
  getUserStream(jerran.discordId),
  getUserStream(rizowski.discordId),
  getUserStream(aaron.discordId)
)
  .flatMap(async function(message) {
    const [ base, action, ...args ] = message.content.replace(token, '').split(' ');

    try {
      commander.do(base, action, client, message, args);
    } catch(e) {
      const command = [{ name: 'command', value: `${token}${ base } ${ action || '' }` }];
      const err = errors.general('Failed to run command', `I suck: ${e.message}`, command);

      await message.channel.send(err);
    }

    logger.log({ message: 'Responding', username: message.author.username, discriminator: message.author.discriminator, channel: message.channel.name || 'direct' });

    return message;
  })
  .subscribe(() => { }, (e) => {
    logger.error({ message: 'Unexpected Error', error: e.message });
  }, () => logger.log({ message: 'done' }));

process.on('unhandledRejection', error => {
  console.log(error);
});
