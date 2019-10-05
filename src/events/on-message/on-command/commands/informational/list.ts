import config from 'config';
import { GuildChannel } from 'discord.js';
import { Command } from '../command.d';

const cmd: Command = {
  title: 'List Groups',
  help: {
    examples: ['list groups'],
    description: 'Returns a list of groups that can be joined.',
  },
  requirements: {
    guild: true,
    basic: true,
  },
  regex: /^(list|get) groups/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action({ message }) {
    const groups = message.guild.channels.reduce((acc, c: GuildChannel): string[] => {
      if (c.type === 'category' && c.name.startsWith('Group')) {
        acc.push(c.name.replace('Group: ', '').toLowerCase());
      }

      return acc;
    }, []);

    await message.channel.send({
      embed: {
        title: 'Available Groups:',
        fields: groups.map((g: string): object => {
          return {
            name: `${g}`,
            // @ts-ignore
            value: `${config.token}join group ${g}`,
            inline: true,
          };
        }),
      },
    });
  },
};

export default cmd;
