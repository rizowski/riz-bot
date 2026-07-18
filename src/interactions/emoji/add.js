import logger from '@local/logger';
import { embeds } from '@local/responses';
import { sanitizeEmojiName, isValidEmojiName } from './sanitize.js';

export default {
  trigger(interaction) {
    return interaction.commandName === 'emoji' && interaction.options.getSubcommand() === 'add';
  },
  ephemeral: false,
  async action(interaction) {
    const { guild } = interaction;
    const attachment = interaction.options.getAttachment('image');
    const requestedName = interaction.options.getString('name');

    const [fileName] = attachment.name.split('.');
    const name = sanitizeEmojiName(requestedName ?? fileName);

    if (!isValidEmojiName(name)) {
      await interaction.editReply(
        embeds.error({
          title: 'The emoji or file name must be between 2 - 32 characters',
          description: `\`${name}\` just isn't cutting it`,
        })
      );
      return;
    }

    const existing = guild.emojis.cache.find((e) => e.name === name);

    if (existing) {
      await interaction.editReply({
        content: `${existing}`,
        ...embeds.error({
          title: 'Emoji Exists',
          description: '(╯°□°）╯︵ ┻━┻',
        }),
      });
      return;
    }

    try {
      const emoji = await guild.emojis.create({
        attachment: attachment.url,
        name,
        reason: `I blame ${interaction.user.username} in ${interaction.channel?.name}`,
      });

      await interaction.editReply({
        content: `${emoji}`,
        ...embeds.success({
          title: 'Emoji created.',
          description: `Just in case, here's how: \`:${name}:\``,
        }),
      });
    } catch (error) {
      logger.error(error);
      await interaction.editReply(
        embeds.error({
          title: 'Aw shit something broke something or something',
          description: `<@100758264047747072> ||${error.message}||`,
        })
      );
    }
  },
};
