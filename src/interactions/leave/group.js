const prefix = 'g:';
const { roleMention } = require('@discordjs/builders');

const cmd = {
  trigger(data) {
    return data.commandName === 'leave' && data.options.getSubcommand() === 'group';
  },
  async action(interaction) {
    const { channel, member } = interaction;
    const role = interaction.options.getMentionable('role');

    if (!role.name.startsWith(prefix)) {
      await channel.send({
        embed: {
          title: 'Invalid Role',
          description: `Must specify a role that starts with \`@${prefix}\``,
          color: 12124160,
        },
      });
      return;
    }

    if (!member) {
      await channel.send({
        embed: {
          title: 'Who are you?',
          description: `I can't seem to place who you are... 👁👄👁`,
          color: 12124160,
        },
      });

      return;
    }

    await member.roles.remove([role.id], 'User requested');

    await interaction.editReply({ content: `Successfully left ${roleMention(role.id)}`, ephemeral: true });
  },
};

module.exports = cmd;
