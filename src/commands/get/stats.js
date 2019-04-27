const cmd = {
  title: 'Get Server Stats',
  example: 'get stats',
  description: 'Fetches server stats',
  requirements: {
    guild: true,
  },
  regex: /^(get|fetch) stats/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action(client, message) {
    const { guilds } = client;
    const [guild] = guilds.first(1);

    await message.channel.send({
      embed: {
        title: 'Server Statistics',
        fields: [
          {
            name: 'Total Emojis',
            value: guild.emojis.size,
            inline: true,
          },
          {
            name: 'Total Users',
            value: guild.members.size,
            inline: true,
          },
          {
            name: 'Total Channels',
            value: guild.channels.size,
            inline: true,
          },
          {
            name: 'Total Roles',
            value: guild.roles.size,
            inline: true,
          },
        ],
      },
    });
  },
};

module.exports = cmd;
