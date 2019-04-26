const { createRandRange } = require('../../utils/math');

const responses = [(ping) => `My ping to discord is ${ping} ms.`, (ping) => `Holy Shit! A whole ${ping} ms.`, () => 'PONG ms!'];

const cmd = {
  title: 'Get my Ping',
  example: 'your ping',
  description: "Responds with the admin's ping to discord",
  requirements: {},
  regex: /^(your )?ping/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  action(client, message) {
    const [cleanPing] = `${client.ping}`.split('.');
    const rand = createRandRange(0, responses.length - 1);
    const response = responses[rand];

    return message.channel.send(response(cleanPing));
  },
};

module.exports = cmd;
