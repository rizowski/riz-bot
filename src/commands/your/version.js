const pkg = require('../../../package');

const cmd = {
  title: 'Get My Version',
  example: 'your version',
  description: "I'll spill the beans and give you my version.",
  requirements: {},
  regex: /^(your )?version/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action(client, message) {
    return message.channel.send(`My current version is: \`v${pkg.version}\``);
  },
};

module.exports = cmd;