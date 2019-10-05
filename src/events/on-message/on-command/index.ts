import config from 'config';
import logger from '../../../logger';
import { client } from '../../../clients/discord';
import { GeneralError } from '../../../errors';
import { doAction } from './commands';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function subscribe(message: any) {
  // @ts-ignore
  const content = message.content.replace(config.token, '');

  try {
    await doAction(content, client, message);
  } catch (error) {
    logger.error(error);

    if (error.serialize) {
      await message.channel.send(error.serialize());
      return;
    }

    const err = new GeneralError({
      title: 'Failed to run command',
      reason: `I suck: ${error.message}`,
      // @ts-ignore
      details: [{ title: 'command', description: `${config.token}${content}` }],
    });

    await message.channel.send(err.serialize());
  }

  logger.info({
    message: 'Action completed.',
    command: content,
    username: message.author.username,
    discriminator: message.author.discriminator,
    // @ts-ignore
    channel: message.channel.name || 'direct',
  });

  return message;
}
