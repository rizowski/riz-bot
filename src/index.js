const config = require('config');
const snake = require('lodash.snakecase');
const logger = require('@local/logger');
const discord = require('@local/discord');
const { embeds } = require('@local/responses');
const interactions = require('./interactions');

const emojiReg = /^(add|create) emoji/i;

discord.login(config.discord.token);

discord.onInteraction(async (data, client) => {
  try {
    if (!data.isCommand()) {
      return;
    }
    await interactions.run(data, client);
  } catch (error) {
    console.error(error);
    await data.reply(`Something failed. ||${error.message}||`);
  }
});

discord.onCommand(async (message, content) => {
  const { attachments, channel, mentions, author } = message;

  if (emojiReg.test(content)) {
    /// Attachment
    if (attachments.size === 0) {
      await message.delete();
      await channel.send(
        embeds.error({ title: 'An attachment is required.', description: 'Please attach an image. 🖼️' })
      );
      return;
    }

    const attachment = attachments.first();

    /// Emoji exists
    const [name] = attachment.name.split('.');

    // eslint-disable-next-line
    const [emojiName = name] = content.trim().replace(emojiReg, '').split(' ').filter(Boolean);
    if (emojiName.length < 2 || emojiName.length > 32) {
      await message.delete();
      await channel.send(
        embeds.error({
          title: `The emoji or file name must be between 2 - 32 characters`,
          description: `\`${emojiName}\` just isn't cutting it`,
        })
      );
      return;
    }
    const emoji = channel.guild.emojis.cache.find((e) => e.name === emojiName);

    if (emoji) {
      await message.delete();
      const response = await channel.send(
        embeds.error({
          title: 'Emoji Exists',
          description: '(╯°□°）╯︵ ┻━┻',
        })
      );

      return response.react(emoji);
    }

    try {
      /// DO work
      const { url } = attachment;
      const { roles } = mentions;

      const result = await channel.guild.emojis.create(url, snake(emojiName), {
        roles,
        reason: `I blame ${author.username} in ${channel.name}`,
      });

      const createEmoji = channel.guild.emojis.cache.get(result.id);

      if (!createEmoji) {
        await channel.send(`Can't find the emoji I just created... Maybe you can?`);
        return;
      }

      await message.delete();
      const response = await channel.send(
        embeds.success({ title: `Emoji created.`, description: `Just in case, here's how: \`:${emojiName}:\`` })
      );
      await response.react(createEmoji);
    } catch (error) {
      logger.error(error);
      await channel.send(
        embeds.error({
          title: 'Aw shit something broke something or something',
          description: `<@100758264047747072> ||${error.message}||`,
        })
      );
    }
  }
});
