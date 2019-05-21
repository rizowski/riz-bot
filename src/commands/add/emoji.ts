import { Role } from 'discord.js';
import { Command, ActionInput } from '../command.d';

import { PreconditionError } from '../../errors';

interface EmojiArgs {
  name: string;
  filename: string;
  url: string;
  roles: Role[];
}

interface EmojiActionInput extends ActionInput {
  args: EmojiArgs;
}

const cmd: Command = {
  title: 'Add Emoji',
  example: 'add emoji [emojiName] [roles...]',
  description: 'Add an emoji to the server. defaults to filename if emojiName is not provided',
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
        const attachment = message.attachments.values().next().value;
        const { filename } = attachment;
        const [name] = args;
        const [emojiName = name] = filename.split('.');
        const emojiExists = message.guild.emojis.exists('name', emojiName);

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
  async action({ message, args }: EmojiActionInput) {
    const { name, filename, url, roles } = args;
    const emojiName = name || filename.split('.')[0];

    const result = await message.guild.createEmoji(
      url,
      emojiName,
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
  },
};

export default cmd;