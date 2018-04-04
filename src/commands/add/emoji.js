const { errors } = require('../../transformers/embeds');
const { GeneralError, InputError } = require('../../errors');

module.exports = {
  title: 'Add Emoji',
  example: 'add emoji [emojiName] [roles...]',
  description: 'Add an emoji to the server. defaults to filename if emojiName is not provided',
  requirements: {
    guild: true,
  },
  trigger(cmd){
    return /(add|create) emoji/i.test(cmd);
  },
  conditions: [
    {
      name: 'there is an attachment',
      condition(message) {
        if (!message.attachments.size) {
          return { result: false, error: new InputError({ reason: 'Emoji is required. Please attach an image' }) };
        }

        return { result: true };
      }
    },
    {
      name: 'emoji is proportional',
      condition(message) {
        const attachment = message.attachments.values().next().value;
        const { height, width } = attachment;

        if(height !== width){
          const dimensions = [
            { name: 'height', value: `${ height }`, inline: true },
            { name: 'width', value: `${ width }`, inline: true },
          ];

          return { result: false, error: new InputError({ reason: 'Emoji malformed. Emojis are best suited with equal dimensions', fields: dimensions }) };
        }

        return { result: true };
      }
    },
    {
      name: 'emoji exists',
      condition(message, client, args) {
        const attachment = message.attachments.values().next().value;
        const { filename } = attachment;
        const [ name ] = args;
        const [ emojiName = name ] = filename.split('.');
        const emojiExists = message.guild.emojis.exists('name', emojiName);

        if (emojiExists) {
          const fields = [{ name: 'Name', value: emojiName }];

          return { result: false, error: new GeneralError({ title: 'Emoji Exists', reason: 'You didn\'t check the emoji list.', fields }) };
        }

        return { result: true };
      }
    }
  ],
  async action(client, message, args=[]) {
    const attachment = message.attachments.values().next().value;
    const { url, filename } = attachment;
    const [ name ] = args;
    const emojiName = name || filename.split('.')[0];
    const roles = message.mentions.roles.map((role) => role.id);

    try {
      const result = await message.guild.createEmoji(url, emojiName, roles, `I blame ${ message.author.username }`);

      const createEmoji = message.guild.emojis.get(result.id);
      await message.react(createEmoji);
    } catch(e) {
      if (e.message.includes('did not match validation regex')) {
        return message.channel.send(errors.general('Failed to create emoji', 'Bad emoji name', [{ name: 'Proposed Emoji Name', value: emojiName }]));
      }

      return await message.channel.send(errors.general('Failed to create Emoji', e.message));
    }
  }
};
