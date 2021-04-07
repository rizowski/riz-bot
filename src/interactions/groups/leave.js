const prefix = 'g:';

const cmd = {
  trigger(data) {
    if (data.name !== 'group') {
      return false;
    }

    const [join] = data.options;

    return join.name === 'leave';
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

    await member.roles.remove([roleId], 'User requested');
  },
};

module.exports = cmd;
