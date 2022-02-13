const pkg = require('../../../package.json');

const cmd = {
  trigger(data) {
    return data.commandName === 'version';
  },
  async action(interaction) {
    await interaction.editReply(`My current version is: \`v${pkg.version}\``);
  },
};

module.exports = cmd;
