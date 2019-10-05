import { Command } from '../command.d';
import { PreconditionError } from '../../../../../errors';

const cmd: Command = {
  title: 'Leave Group',
  help: {
    examples: ['leave group <name>'],
    description: 'Removes ones self from a group',
  },
  requirements: {
    guild: true,
    basic: true,
  },
  conditions: [
    {
      name: 'Specified role(s)',
      condition(message, client, args) {
        if (args.length === 0) {
          return new PreconditionError({ reason: 'Must specify a group name' });
        }
      },
    },
    {
      name: 'role exists',
      condition(message, client, args) {
        const roleName = args[0];
        const role = message.member.roles.find((r) => {
          return r.name.replace('Group: ', '').toLowerCase() === roleName.toLowerCase();
        });

        if (!role) {
          return new PreconditionError({
            reason: `You don't have the role for [Group: ${roleName}] as far as I can tell`,
          });
        }
      },
    },
  ],
  regex: /^leave group/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  async action({ message, args }) {
    const user = message.member;

    const role = user.roles.find((r) => {
      return r.name.replace('Group: ', '').toLowerCase() === args[0].toLowerCase();
    });

    await user.removeRoles([role]);

    await message.react('👍');
  },
};

export default cmd;
