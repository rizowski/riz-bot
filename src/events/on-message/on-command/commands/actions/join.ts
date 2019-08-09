import { Command } from '../command.d';
import { PreconditionError } from '../../../../../errors';
import { features } from '../roles';

const cmd: Command = {
  title: 'Join',
  help: {
    description: 'Allows you to see the requested category. ex) join admin',
    examples: ['join <feature>'],
  },
  requirements: {
    guild: true,
  },
  conditions: [
    {
      name: 'specified arguments',
      condition(message, client, args) {
        if (args.length === 0) {
          return new PreconditionError({ reason: 'Must specify feature name' });
        }
      },
    },
    {
      name: 'is a feature',
      condition(message) {
        const result = features.some((f) => {
          return f.match.test(message.content);
        });

        if (!result) {
          return new PreconditionError({ reason: 'Feature not available.' });
        }
      },
    },
    {
      name: 'already have permission',
      condition(message) {
        const result = features.some((f) => {
          return message.member.roles.has(f.roleId);
        });

        if (result) {
          return new PreconditionError({ reason: 'Role is already added' });
        }
      },
    },
  ],
  regex: /^join/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  async action({ message }) {
    const found = features.find((f) => f.match.test(message.content));

    if (!found) {
      return;
    }

    const { roleId } = found;

    await message.member.addRoles([roleId]);
    await message.react('👍');
  },
};

export default cmd;
