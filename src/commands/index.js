const find = require('lodash.find');
const logger = require('../logger');
const { GuildError } = require('../errors');
const commands = require('./all');
const help = require('./help');

function isInGuild(message) {
  return message.guild && message.guild.available;
}

function getMissingReqs(cmdReq, currentReqs){
  return Object.entries(cmdReq)
    .reduce((acc, [ key, value ]) => {
      // console.log(entry);
      const current = currentReqs[key];
      if(current.value !== value) {
        acc.push(current);
      }
      return acc;
    }, []);
}

function getCurrentReqs(message/*, client*/) {
  return {
    guild: {
      error: new GuildError(),
      value: isInGuild(message)
    },
  };
}

function getErrors(conditions, message, client, args) {
  const results = conditions.map(({ name, condition }) => {
    logger.log({ message: `Checking if ${ name }...` });
    return condition(message, client, args);
  });

  const error = find(results, (r) => !r.result);

  if(error){
    return error.error;
  }

  return null;
}

module.exports = {
  async do(cmd, subCmd, client, message, args) {
    if(cmd === 'help') {
      return help.action(client, message);
    }
    const executableCommands = commands.filter((c) => c.trigger(`${cmd} ${subCmd}`));
    if (!executableCommands.length) {
      return null;
    }

    if (executableCommands.length > 1) {
      logger.warn(`Found more than one command to execute ${executableCommands.length}`);
    }

    const currentReqs = getCurrentReqs(message);
    const [ command ] = executableCommands;
    const { requirements } = command;
    const missingReqs = getMissingReqs(requirements, currentReqs);

    if (missingReqs.length) {
      const [ req ] = missingReqs;
      const embeds = req.error.createEmbed();

      return message.channel.send(embeds);
    }

    const error = getErrors(command.conditions, message, client, args);

    if (error) {
      return message.channel.send(error.createEmbed());
    }

    return command.action(client, message, args);
  }
};
