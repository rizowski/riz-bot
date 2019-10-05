import { GuildChannel } from 'discord.js';
import wuzzy from 'wuzzy';
import config from 'config';
import { Command } from '../command.d';
import { PreconditionError } from '../../../../../errors';

const cmd: Command = {
  title: 'Create Group',
  help: {
    description: 'Allows you to create a particular gaming group',
    examples: ['create group <name>'],
  },
  requirements: {
    guild: true,
    mod: true,
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
      name: 'group exists',
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

        if (result) {
          throw new PreconditionError({
            reason: `There is a ${result.prob * 100}% chance there is a group with the name of ${result.groupName}.`,
            details: [
              // @ts-ignore
              { title: 'suggestion', description: `${config.token}list groups`, inline: true },
              // @ts-ignore
              { title: 'suggestion 2', description: `${config.token}join group ${groupName}`, inline: true },
            ],
          });
        }
      },
    },
  ],
  regex: /^create group/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  async action({ message, args }) {
    const group = args[0].toLowerCase();
    let foundRole = message.guild.roles.find((role) => {
      return role.name.replace('Group:', '') === group;
    });

    if (!foundRole) {
      foundRole = await message.guild.createRole(
        {
          name: `Group: ${args[0]}`,
          mentionable: false,
        },
        `Could not find role "Group:${group}"`
      );
    }

    const parent = await message.guild.createChannel(`Group: ${group}`, {
      type: 'category',
      permissionOverwrites: [
        {
          id: message.guild.defaultRole.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: foundRole.id,
          allow: ['VIEW_CHANNEL'],
        },
      ],
    });

    await message.guild.createChannel(group, {
      type: 'text',
      parent,
      permissionOverwrites: [
        {
          id: message.guild.defaultRole.id,
          deny: ['VIEW_CHANNEL'],
        },
      ],
    });

    await message.guild.createChannel(group, {
      type: 'voice',
      parent,
      permissionOverwrites: [
        {
          id: message.guild.defaultRole.id,
          deny: ['VIEW_CHANNEL'],
        },
      ],
    });

    await message.member.addRoles([foundRole]);
    await message.react('👍');
  },
};

export default cmd;
