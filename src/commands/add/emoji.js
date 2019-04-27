const { PreconditionError, CommandError } = require('../../errors');

const cmd = {
  title: 'Add Emoji',
  example: 'add emoji [emojiName] [roles...]',
  description: 'Add an emoji to the server. defaults to filename if emojiName is not provided',
  requirements: {
    guild: true,
  },
  regex: /^(add|create) emoji/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  parseArgs(args, message) {
    const attachment = message.attachments.values().next().value;
    const roles = message.mentions.roles.map((role) => role.id);
    const { url, filename } = attachment;

    return { name: args[0], roles, url, filename };
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
          const dimensions = [{ name: 'height', value: `${height}`, inline: true }, { name: 'width', value: `${width}`, inline: true }];

          return new PreconditionError({
            reason: 'Emoji malformed. Emojis are best suited with equal dimensions',
            fields: dimensions,
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
          const fields = [{ name: 'Name', value: emojiName }];

          return new PreconditionError({
            title: 'Emoji Exists',
            reason: "You didn't check the emoji list.",
            fields,
          });
        }
      },
    },
  ],
  async action(client, message, args) {
    const { name, filename, url, roles } = args;
    const emojiName = name || filename.split('.')[0];

    const result = await message.guild.createEmoji(url, emojiName, roles, `I blame ${message.author.username} in ${message.channel.name}`);

    const createEmoji = message.guild.emojis.get(result.id);
    await message.react(createEmoji);
  },
  onError(error, parsedArgs) {
    const title = 'Failed to create emoji';

    if (error.message.includes('did not match validation regex')) {
      throw new CommandError({
        title,
        reason: 'Bad emoji name',
        fields: [{ name: 'Proposed Emoji Name', value: parsedArgs.emojiName }],
      });
    }

    throw new CommandError({
      title,
      reason: error.message,
    });
  },
};

module.exports = cmd;
