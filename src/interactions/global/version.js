const pkg = require('../../../package.json');

const cmd = {
  trigger(data) {
    return data.name === 'version';
  },
  conditions: [],
  async action({ channel }) {
    return channel.send(`My current version is: \`v${pkg.version}\``);
  },
};

module.exports = cmd;
