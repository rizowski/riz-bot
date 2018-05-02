const { createRandRange } = require('../../utils/math');

const responses = [
  (ping) => (`My ping to discord is ${ ping } ms.`),
  (ping) => (`Holy Shit! A whole ${ ping } ms.`),
  () => ('PONG ms!')
];

module.exports = {
  title: 'Get my Ping',
  example: 'your ping',
  description: 'Responds with the admin\'s ping to discord',
  requirements: {},
  trigger(cmd){
    return /^(your )?ping/i.test(cmd);
  },
  conditions: [],
  action(client, message) {
    const [ cleanPing ] = `${client.ping}`.split('.');
    const rand = createRandRange(0, responses.length - 1);
    const response = responses[rand];

    return message.channel.send(response(cleanPing));
  }
};
