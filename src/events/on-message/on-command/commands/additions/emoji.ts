import snake from 'lodash.snakecase';
import { Command, ActionInput } from '../command.d';

import { PreconditionError } from '../../../../../errors';
import logger from '../../../../../logger';

const cmd: Command = {
  title: 'Add Emoji',
  help: {
    description: 'Add an emoji to the server. defaults to filename if emojiName is not provided',
    examples: ['add emoji [emojiName] [roles...]'],
  },
  requirements: {
    guild: true,
    mod: true,
  },
  regex: /^(add|create) emoji/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [
    {
      name: 'there is an attachment',
      condition(message) {
        if (message.attachments.size === 0) {
          return new PreconditionError({ reason: 'Emoji is required. Please attach an image' });
        }
      },
    },
    {
      name: 'emoji is proportional',
      condition(message) {
        const attachment = message.attachments.values().next().value;
        const { height, width } = attachment;

        if (height !== width) {
          const dimensions = [
            { title: 'height', description: `${height}`, inline: true },
            { title: 'width', description: `${width}`, inline: true },
          ];

          return new PreconditionError({
            reason: 'Emoji malformed. Emojis are best suited with equal dimensions',
            details: dimensions,
          });
        }
      },
    },
    {
      name: 'emoji exists',
      condition(message, client, args) {
        const attachment = message.attachments.first();

        const [name] = args;
        const [emojiName = name] = attachment.filename.split('.');
        const emojiExists = message.guild.emojis.some((e) => e.name === emojiName);

        if (emojiExists) {
          const details = [{ title: 'Name', description: emojiName }];

          return new PreconditionError({
            title: 'Emoji Exists',
            reason: "You didn't check the emoji list.",
            details,
          });
        }
      },
    },
  ],
  async action({ message, args }: ActionInput) {
    const { attachments, mentions } = message;
    const attachment = attachments.first();
    const { url, filename } = attachment;
    const [name] = args;
    const emojiName = name || filename.split('.')[0];
    const { roles } = mentions;

    logger.info({ emojiName, filename });

    try {
      const result = await message.guild.createEmoji(
        url,
        snake(emojiName),
        roles,
        // @ts-ignore
        `I blame ${message.author.username} in ${message.channel.name}`
      );

      const createEmoji = message.guild.emojis.get(result.id);

      if (!createEmoji) {
        await message.channel.send(`Can't find the emoji I just created... Maybe you can?`);
        return;
      }

      await message.react(createEmoji);
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  },
};

export default cmd;
