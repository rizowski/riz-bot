const { PreconditionError } = require('../../errors');

const cmd = {
  title: 'Remove Role(s)',
  example: 'remove role @role',
  description: 'Removes a or multiple roles from yourself',
  requirements: {
    basic: true,
  },
  conditions: [
    {
      name: 'Specified role(s)',
      condition(message) {
        if (message.mentions.roles.size === 0) {
          return new PreconditionError({ reason: 'Must specify 1 or more roles' });
        }
      },
    },
  ],
  regex: /^remove role(s)?/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  async action({ message }) {
    const user = message.member;

    if (user.roles.size < 1) {
      return;
    }

    const rolesToRemove = message.mentions.roles.filter((r) => {
      if (r.name.includes('lv.')) {
        return false;
      }

      if (r.id === '362768455675674634') {
        return false;
      }

      return true;
    });

    await user.removeRoles(rolesToRemove, 'User Requested');
  },
};

module.exports = cmd;
