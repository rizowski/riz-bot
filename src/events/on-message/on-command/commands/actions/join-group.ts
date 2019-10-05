import { GuildChannel } from 'discord.js';
import wuzzy from 'wuzzy';
import { Command } from '../command.d';
import { PreconditionError } from '../../../../../errors';

const cmd: Command = {
  title: 'Join Group',
  help: {
    description: 'Allows you to join a gaming group',
    examples: ['join group <name>'],
  },
  requirements: {
    guild: true,
    basic: true,
  },
  conditions: [
    {
      name: 'specified arguments',
      condition(message, client, args) {
        if (args.length === 0) {
          return new PreconditionError({ reason: 'Must specify group name' });
        }
      },
    },
    {
      name: 'is a group',
      condition(message, client, args) {
        const groupName = args[0].toLowerCase();
        const result = message.guild.channels
          .reduce((acc, thing: GuildChannel): string[] => {
            if (thing.type === 'category' && thing.name.startsWith('Group:')) {
              acc.push(thing.name.replace('Group: ', '').toLowerCase());
            }

            return acc;
          }, [])
          .map((name) => {
            const result = wuzzy.jaccard(groupName, name);

            return { name, groupName, prob: result };
          })
          .find((result) => {
            return result.prob > 0.9;
          });

        if (!result) {
          return new PreconditionError({
            reason: `I could not find the group [${groupName}] you want to join with confidence. Need a confidence level of 90 or higher. Try retyping the name a different way.`,
          });
        }
      },
    },
    {
      name: 'role exists',
      condition(message, client, args) {
        const role = message.guild.roles.find((r) => {
          return r.name.replace('Group: ', '').toLowerCase() === args[0].toLowerCase();
        });

        if (!role) {
          return new PreconditionError({ reason: `Count not find role ${args[0]}` });
        }
      },
    },
  ],
  regex: /^join group/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  async action({ message, args }) {
    const role = message.guild.roles.find((r) => {
      return r.name.replace('Group: ', '').toLowerCase() === args[0].toLowerCase();
    });

    await message.member.addRoles([role], 'User requested');
    await message.react('👍');
  },
};

export default cmd;
