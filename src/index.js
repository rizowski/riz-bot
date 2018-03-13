const { Observable } = require('rxjs');
const { message, client } = require('./discord');
const commander = require('./commands');
const { general } = require('./utils/error');

const people = {
  '108352053692125184': 'bacon',
  '108568431053246464': 'zack',
  '189006310501646336': 'jerran',
  '100758264047747072': 'rizowski',
  '65055432095301632': 'aaron'
};

message
  .filter((message) => message.content.startsWith('!'))
  .filter((message) => !!people[message.author.id])
  .throttle(() => Observable.interval(3000))
  .flatMap(async function(message) {
    const [ base, action, ...args ] = message.content.split('!').join('').split(' ');

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
    const channel = msg.channel.name && ` in ${ msg.channel.name }`;
    console.log(`Responding to ${ msg.author.username }#${ msg.author.discriminator }${channel || ''}`);
  }, (e) => {
    console.error('Unexpected', e);
  }, () => console.log('done'));
