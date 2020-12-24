const prefix = 'g:';

const cmd = {
  trigger(data) {
    if (data.name !== 'group') {
      return false;
    }

    const [join] = data.options;

    return join.name === 'join';
  },
  async action({ data, guild, channel, member }) {
    const roleId = data.options?.[0]?.options?.[0].value;
    const role = guild.roles.cache.get(roleId);

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

    const additional = member.roles.cache.get(roleId)
      ? '\nBTW: you were already in the group according to my data. 😐 awk...'
      : '';

    if (!additional) {
      await member.roles.add([roleId], 'User requested');
    }

    const channelName = role.name.replace(`${prefix}`, '').toLowerCase();

    const textChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === 'text');

    await textChannel.send(`Hey <@${member.id}>! Welcome to the group.${additional}`);
  },
};

module.exports = cmd;
