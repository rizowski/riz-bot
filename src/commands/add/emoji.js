const { general } = require('../../utils/error');

function isInGuild(message) {
  return message.guild && message.guild.available;
}

module.exports = async (client, message, args=[]) => {
  if(!isInGuild(message)) {
    return message.channel.send(general('Need to be in a guild'));
  }
  if (!message.attachments.size) {
    return message.channel.send(general('emoji required', 'Please attach an image with the command.'));
  }

  const attachment = message.attachments.values().next().value;
  const { height, width, url, filename } = attachment;

  if(height !== width){
    const dimensions = [
      { name: 'height', value: `${ height }`, inline: true },
      { name: 'width', value: `${ width }`, inline: true },
    ];

    return message.channel.send(general('emoji malformed', 'Emojis are best suited with equal dimensions', dimensions));
  }

  const emojiName = args[0] || filename.split('.')[0];
  const emojiExists = message.guild.emojis.exists('name', emojiName);

  if (emojiExists) {
    return message.channel.send(general('emoji exists', 'You didn\'t check the emoji list.', [{ name: 'Name', value: emojiName }]));
  }

  try {
    const result = await message.guild.createEmoji(url, emojiName);

    const createEmoji = message.guild.emojis.get(result.id);
    await message.react(createEmoji);
  } catch(e) {
    if (e.message.includes('did not match validation regex')) {
      return message.channel.send(general('Failed to create emoji', 'Bad emoji name', [{ name: 'Proposed Emoji Name', value: emojiName }]));
    }

    await message.channel.send(general('Failed to create Emoji', e.message));
  }
};
