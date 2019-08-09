import { Command } from '../command.d';

const cmd: Command = {
  title: 'Get Server Stats',
  help: {
    examples: ['get stats'],
    description: 'Fetches server stats',
  },
  requirements: {
    guild: true,
    basic: true,
  },
  regex: /^(get|fetch) stats/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action({ client, message }) {
    const { guilds } = client;
    const [guild] = guilds.first(1);

    const { voice, text } = guild.channels.reduce(
      (acc, c) => {
        if (c.type === 'voice') {
          acc.voice.push(c);
        }

        if (c.type === 'text') {
          acc.text.push(c);
        }

        return acc;
      },
      { voice: [], text: [] }
    );

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
            name: 'Total Text Channels',
            value: text.length,
            inline: true,
          },
          {
            name: 'Total Voice Channels',
            value: voice.length,
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

export default cmd;
