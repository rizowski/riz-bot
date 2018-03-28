const { merge } = require('rxjs/observable/merge');
const { message, client } = require('./discord');
const commander = require('./commands');
const { general } = require('./utils/error');
const logger = require('./logger');

const people = {
  bacon: '108352053692125184',
  zack: '108568431053246464',
  jerran: '189006310501646336',
  rizowski: '100758264047747072',
  aaron: '65055432095301632'
};
const command = message.filter((message) => message.content.startsWith('!'));

function byPerson(person){
  return (msg) => (msg.author.id === person);
}

function getUserStream(person) {
  return command.filter(byPerson(person))
    .throttleTime(3000);
}

merge(
  getUserStream(people.bacon),
  getUserStream(people.zack),
  getUserStream(people.jerran),
  getUserStream(people.rizowski),
  getUserStream(people.aaron)
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
