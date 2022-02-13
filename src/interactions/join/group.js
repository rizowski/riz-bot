const prefix = 'g:';
const { channelMention } = require('@discordjs/builders');

const cmd = {
  trigger(data) {
    return data.commandName === 'join' && data.options.getSubcommand() === 'group';
  },
  async action(interaction) {
    const { guild, member } = interaction;
    const role = interaction.options.getMentionable('role');

    if (!role.name.startsWith(prefix)) {
      await interaction.editReply({
        embed: {
          title: 'Invalid Role',
          description: `Must specify a role that starts with \`@${prefix}\``,
          color: 12124160,
        },
      });
      return;
    }

    if (!member) {
      await interaction.editReply({
        embed: {
          title: 'Who are you?',
          description: `I can't seem to place who you are... 👁👄👁`,
          color: 12124160,
        },
      });

      return;
    }

    const additional = member.roles.cache.get(role.id)
      ? '\nBTW: you were already in the group according to my data. 😐 awk...'
      : '';

    if (!additional) {
      await member.roles.add([role.id], 'User requested');
    }

    const channelName = role.name.replace(`${prefix}`, '').toLowerCase();

    const textChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === 'GUILD_TEXT');

    await textChannel.send(`Hey <@${member.id}>! Welcome to the group.${additional}`);

    interaction.editReply({ content: `Successfully joined ${channelMention(textChannel.id)}`, ephemeral: true });
  },
};

module.exports = cmd;
