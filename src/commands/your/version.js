const pkg = require('../../../package');

module.exports = {
  title: 'Get My Version',
  example: 'your version',
  description: 'I\'ll spill the beans and give you my version.',
  requirements: {},
  trigger(cmd) {
    return /(your )?version/i.test(cmd);
  },
  conditions: [],
  action(client, message) {
    return message.channel.send(`v${ pkg.version }`);
  }
};
