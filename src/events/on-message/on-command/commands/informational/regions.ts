import { Command } from '../command.d';
import emoji from '../../../../../emojis';

const cmd: Command = {
  title: 'US Regions',
  help: {
    examples: ['get regions'],
    description: 'Responds with current available US Regions to switch to',
  },
  requirements: {
    guild: true,
    basic: true,
  },
  regex: /^(get|fetch) regions/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action({ client, message }) {
    message.channel.startTyping();
    const regions = await client.fetchVoiceRegions();
    // @ts-expect-error
    const sorted = regions.filter((r) => r.name.startsWith('US')).sort((a, b) => b.optimal);

    const fields = sorted.map((data) => {
      const optimal = data.optimal ? emoji.star : emoji.meh;
      const name = data.id === message.guild.region ? `Current Region (${data.name})` : `${data.name}`;

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
    message.channel.stopTyping();
  },
};

export default cmd;
