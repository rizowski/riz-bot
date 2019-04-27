const emoji = require('../../emojis');

const cmd = {
  title: 'US Regions',
  example: 'get regions',
  description: 'Responds with current available US Regions to switch to',
  requirements: {
    guild: true,
  },
  regex: /^(get|fetch) regions/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action(client, message) {
    await message.channel.startTyping();
    const regions = await client.fetchVoiceRegions();
    const sorted = regions.filter((r) => r.name.startsWith('US')).sort((a, b) => b.optimal);

    const fields = sorted.map((data) => {
      const optimal = data.optimal ? emoji.star : emoji.meh;
      const name =
        data.id === message.guild.region ? `Current Region (${data.name})` : `${data.name}`;

      return {
        name,
        value: optimal,
        inline: true,
      };
    });

    await message.channel.send({
      embed: {
        title: 'Available US Regions:',
        fields,
      },
    });
    await message.channel.stopTyping();
  },
};

module.exports = cmd;
