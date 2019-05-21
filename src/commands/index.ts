import { Client, Message } from 'discord.js';
import logger from '../logger';
import { GuildError, PermissionsError, PreconditionError } from '../errors';
import { getPermissions, Permissions } from '../utils/permissions';
import { Command, Condition, Requirement as CommandRequirement } from './command.d';
import commands from './all';

interface Requirement {
  error: GuildError | PermissionsError;
  value: boolean;
}

interface CurrentRequirement {
  guild: Requirement;
  basic: Requirement;
  mod: Requirement;
}

function getMissingReqs(
  cmdReq: CommandRequirement,
  currentReqs: CurrentRequirement | any
): Requirement[] {
  return Object.entries(cmdReq).reduce((acc: Requirement[], [key, value]: [string, boolean]) => {
    const current: Requirement = currentReqs[key];

    if (current.value !== value) {
      acc.push(current);
    }

    return acc;
  }, []);
}

function getCurrentReqs(permissions: Permissions): CurrentRequirement {
  return {
    guild: {
      error: new GuildError({ reason: 'Not in a guild' }),
      value: permissions.inGuild,
    },
    basic: {
      error: new PermissionsError('Basic'),
      value: permissions.basic,
    },
    mod: {
      error: new PermissionsError('Mod'),
      value: permissions.mod,
    },
  };
}

function getErrors(
  conditions: Condition[],
  message: Message,
  client: Client,
  args: string[]
): PreconditionError | undefined {
  for (const { name, condition } of conditions) {
    logger.info(`Checking if ${name}...`);

    const result = condition(message, client, args);

    if (result) {
      logger.error({ error: result });

      return result;
    }
  }
}

export async function doAction(content: string, client: Client, message: Message): Promise<any> {
  const permissions = getPermissions(message);
  logger.info({ user: message.author.username, permissions });

  const executableCommands = commands.filter((c: Command) => c.trigger(content));

  if (executableCommands.length === 0) {
    logger.warn(`No commands found for ${content}`);
    return null;
  }

  if (executableCommands.length > 1) {
    logger.warn(`Found more than one command to execute ${executableCommands.length}`);
  }

  const currentReqs = getCurrentReqs(permissions);
  const [command] = executableCommands;
  logger.debug({ title: command.title });
  const { requirements } = command;
  const [missingReq] = getMissingReqs(requirements, currentReqs);

  if (missingReq) {
    const embeds = missingReq.error.serialize();

    return message.channel.send(embeds);
  }

  const args = content
    .replace(command.regex, '')
    .split(' ')
    .filter(Boolean);

  const error = getErrors(command.conditions, message, client, args);

  if (error) {
    return message.channel.send(error.serialize());
  }

  return command.action({ client, message, args, permissions });
}
