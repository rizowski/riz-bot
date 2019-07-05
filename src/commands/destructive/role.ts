import { Role } from 'discord.js';
import { Command } from '../command';
import { PreconditionError } from '../../errors';
import { features } from '../roles';

const cmd: Command = {
  title: 'Remove Role(s)',
  example: 'remove role @role',
  description: 'Removes a or multiple roles from yourself',
  requirements: {
    basic: true,
  },
  conditions: [
    {
      name: 'Specified role(s)',
      condition(message, client, args) {
        if (args.length === 0 && message.mentions.roles.size === 0) {
          return new PreconditionError({ reason: 'Must specify 1 or more roles' });
        }
      },
    },
  ],
  regex: /^remove role(s)?/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  async action({ message, args }) {
    const user = message.member;

    if (user.roles.size < 2) {
      return;
    }

    let mentionedRoles: Role[] = [];
    let roleNames: string[] = [];

    if (message.mentions.roles.size > 0) {
      const roles = message.mentions.roles.filter((r) => {
        if (r.name.includes('lv.')) {
          return false;
        }

        if (r.id === '362768455675674634') {
          return false;
        }

        return true;
      });

      mentionedRoles = mentionedRoles.concat(...roles.array());
    }

    if (args.length > 0) {
      const roles = features
        .filter((f) => {
          return Boolean(
            args.find((a: string) => {
              return f.match.test(a);
            })
          );
        })
        .map((f) => {
          return f.roleId;
        });

      roleNames = roleNames.concat(...roles);
    }

    const rolesToRemove = [...mentionedRoles, ...roleNames];

    if (rolesToRemove.length > 0) {
      // @ts-ignore
      await user.removeRoles(rolesToRemove, 'User Requested');
      await message.react('👍');
      return;
    }

    await message.channel.send('¯\\_(ツ)_/¯ Not sure what to remove.');
  },
};

export default cmd;
