import { ChannelType, channelMention } from 'discord.js';
import { embeds } from '@local/responses';
import { GROUP_PREFIX, resolveGroupRole, respondWithGroups } from '../groups.js';

export default {
  trigger(interaction) {
    return interaction.commandName === 'join' && interaction.options.getSubcommand() === 'group';
  },
  ephemeral: true,
  autocomplete: respondWithGroups,
  async action(interaction) {
    const { guild, member } = interaction;
    const role = resolveGroupRole(guild, interaction.options.getString('role'));

    if (!role) {
      await interaction.editReply(
        embeds.error({
          title: 'Invalid Role',
          description: `Must specify a group that starts with \`@${GROUP_PREFIX}\` — try the autocomplete suggestions.`,
        })
      );
      return;
    }

    if (!member) {
      await interaction.editReply(
        embeds.error({
          title: 'Who are you?',
          description: `I can't seem to place who you are... 👁👄👁`,
        })
      );
      return;
    }

    const additional = member.roles.cache.has(role.id)
      ? '\nBTW: you were already in the group according to my data. 😐 awk...'
      : '';

    if (!additional) {
      await member.roles.add(role.id, 'User requested');
    }

    const channelName = role.name.replace(GROUP_PREFIX, '').toLowerCase();
    const textChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildText);

    if (textChannel) {
      await textChannel.send(`Hey <@${member.id}>! Welcome to the group.${additional}`);
      await interaction.editReply({ content: `Successfully joined ${channelMention(textChannel.id)}` });
      return;
    }

    await interaction.editReply({ content: `Successfully joined \`@${role.name}\`` });
  },
};
