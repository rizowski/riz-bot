const { merge } = require('rxjs/observable/merge');
const { message, client } = require('./discord');
const commander = require('./commands');
const { general } = require('./utils/error');
const logger = require('./logger');
const { bacon, zack, jerran, aaron, rizowski } = require('./users');

const command = message.filter((message) => message.content.startsWith('!'));

function byPerson(person){
  return (msg) => (msg.author.id === person);
}

function getUserStream(person) {
  return command.filter(byPerson(person))
    .throttleTime(3000);
}

merge(
  getUserStream(bacon.discordId),
  getUserStream(zack.discordId),
  getUserStream(jerran.discordId),
  getUserStream(rizowski.discordId),
  getUserStream(aaron.discordId)
)
  .flatMap(async function(message) {
    const [ base, action, ...args ] = message.content.replace('!', '').split(' ');

    try {
      commander.do(base, action, client, message, args);
    } catch(e) {
      const command = [{ name: 'command', value: `!${ base } ${ action || '' }` }];
      const err = general('Failed to run command', `I suck: ${e.message}`, command);
      await message.channel.send(err);
    }

    return message;
  })
  .subscribe((msg) => {
    logger.log({ message: 'Responding', username: msg.author.username, discriminator: msg.author.discriminator, channel: msg.channel.name });
  }, (e) => {
    logger.error({ message: 'Unexpected', error: e });
  }, () => logger.log({ message: 'done' }));

process.on('unhandledRejection', error => {
  console.log(error);
});
