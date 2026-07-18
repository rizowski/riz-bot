import pkg from '../../../package.json' with { type: 'json' };

export default {
  trigger(interaction) {
    return interaction.commandName === 'version';
  },
  ephemeral: false,
  async action(interaction) {
    await interaction.editReply(`My current version is: \`v${pkg.version}\``);
  },
};
