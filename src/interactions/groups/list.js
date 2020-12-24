const prefix = 'g:';

const cmd = {
  trigger(data) {
    return data.name === 'group' && !!data.options?.find((option) => option.name === 'list');
  },
  conditions: [],
  async action({ guild, channel }) {
    const groups = guild.roles.cache.filter((r) => r.name.startsWith(prefix));

    await channel.send({
      embed: {
        title: 'Available Groups:',
        description: `Join a group by executing \`/group join ${prefix} role-name\``,
        fields: groups.map((g) => {
          const name = g.name.replace(`${prefix}`, '');

          return {
            name,
            value: `\`@${g.name}\``,
            inline: true,
          };
        }),
      },
    });
  },
};

module.exports = cmd;
