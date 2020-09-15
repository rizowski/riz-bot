import config from 'config';
import logger from '../../../../logger';
import { Command, Permissions } from './command.d';

interface Field {
  name: string;
  value: string;
  inline?: boolean;
}

interface Embed {
  title: string;
  fields: Field[];
}

interface HelpText {
  embed: Embed;
}

function createHelp(pms: Permissions): HelpText | undefined {
  const fields = require('./all')
    .default.map((cmd: Command): Field | undefined => {
      const { requirements } = cmd;

      if (Object.keys(requirements).length > 0) {
        if (requirements.basic && requirements.basic !== pms.basic) {
          return undefined;
        }

        if (requirements.mod && requirements.mod !== pms.mod) {
          return undefined;
        }
      }

      if (cmd.title === 'Help') {
        return undefined;
      }

      return {
        // @ts-expect-error
        name: `${config.token}${cmd.help.examples[0]}`,
        value: cmd.help.description,
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

const cmd: Command = {
  title: 'Help',
  help: {
    examples: ['help'],
    description: 'This will show this help.',
  },
  requirements: {},
  regex: /^help/i,
  trigger: (content) => {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action({ message, permissions }) {
    const content = createHelp(permissions);

    if (!content) {
      logger.warn('Nothing to respond with. User does not have permissions');
      return;
    }

    return message.channel.send(content);
  },
};

export default cmd;
