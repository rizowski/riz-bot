const config = require('config');
const logger = require('../logger');

function createHelp(pms) {
  const fields = require('./all')
    .map((cmd) => {
      if (
        cmd.requirements &&
        cmd.requirements.basic !== pms.basic &&
        cmd.requirements.mod !== pms.mod
      ) {
        return undefined;
      }

      if (cmd.title === 'Help') {
        return undefined;
      }

      return {
        name: `${config.token}${cmd.example}`,
        value: cmd.description,
        inline: true,
      };
    })
    .filter(Boolean);

  const help = {
    embed: {
      title: 'Help',
      fields,
    },
  };

  if (fields.length === 0) {
    return;
  }

  return help;
}

const cmd = {
  title: 'Help',
  example: 'help',
  description: 'This will show this help.',
  requirements: {},
  regex: /^help$/i,
  trigger: (content) => {
    return cmd.regex.test(content);
  },
  conditions: [],
  action({ message, permissions }) {
    const content = createHelp(permissions);

    if (!content) {
      logger.warn('Nothing to respond with. User does not have permissions');
      return;
    }

    return message.channel.send(content);
  },
};

module.exports = cmd;
