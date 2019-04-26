const logger = require('../logger');
const { GuildError } = require('../errors');
const commands = require('./all');
const help = require('./help');

function isInGuild(message) {
  return message.guild && message.guild.available;
}

function getMissingReqs(cmdReq, currentReqs) {
  return Object.entries(cmdReq).reduce((acc, [key, value]) => {
    const current = currentReqs[key];

    if (current.value !== value) {
      acc.push(current);
    }

    return acc;
  }, []);
}

function getCurrentReqs(message /* , client */) {
  return {
    guild: {
      error: new GuildError(),
      value: isInGuild(message),
    },
  };
}

function getErrors(conditions, message, client, args) {
  for (const { name, condition } of conditions) {
    logger.info(`Checking if ${name}...`);

    const result = condition(message, client, args);

    if (result) {
      return result;
    }
  }
}

module.exports = {
  async doAction(content, client, message) {
    if (help.trigger(content)) {
      return help.action(client, message);
    }
    const executableCommands = commands.filter((c) => c.trigger(content));

    if (executableCommands.length === 0) {
      return null;
    }

    if (executableCommands.length > 1) {
      logger.warn(`Found more than one command to execute ${executableCommands.length}`);
    }

    const currentReqs = getCurrentReqs(message);
    const [command] = executableCommands;
    logger.debug({ title: command.title });
    const { requirements } = command;
    const missingReqs = getMissingReqs(requirements, currentReqs);

    if (missingReqs.length > 0) {
      const [req] = missingReqs;
      const embeds = req.error.createEmbed();

      return message.channel.send(embeds);
    }

    const args = content
      .replace(command.regex, '')
      .split(' ')
      .filter(Boolean);

    const error = await getErrors(command.conditions, message, client, args);

    if (error) {
      const title = `Failed to run ${command.title}`;
      const color = 12124160;

      const response = {
        embed: {
          title,
          color,
          description: error.description,
          fields: [
            {
              name: 'Reason:',
              value: error.reason,
            },
          ],
        },
      };

      return message.channel.send(response);
    }

    return command.action(client, message, args);
  },
};
