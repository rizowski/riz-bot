import { ChannelType, channelMention, roleMention, time } from 'discord.js';
import { embeds } from '@local/responses';
import { GROUP_PREFIX, resolveGroupRole, respondWithGroups } from '../groups.js';

async function countMembers(guild, role) {
  try {
    await guild.members.fetch({ time: 5000 });

    return { count: role.members.size, exact: true };
  } catch {
    // Without the privileged GuildMembers intent only cached members are visible.
    return { count: role.members.size, exact: false };
  }
}

export default {
  trigger(interaction) {
    return interaction.commandName === 'group' && interaction.options.getSubcommand() === 'info';
  },
  ephemeral: false,
  autocomplete: respondWithGroups,
  async action(interaction) {
    const { guild } = interaction;
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

    const channelName = role.name.replace(GROUP_PREFIX, '').toLowerCase();
    const textChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildText);
    const voiceChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildVoice);
    const { count, exact } = await countMembers(guild, role);

    const fields = [
      { name: 'Role', value: roleMention(role.id), inline: true },
      { name: 'Members', value: exact ? `${count}` : `~${count} (cached)`, inline: true },
      { name: 'Created', value: time(role.createdAt, 'R'), inline: true },
      { name: 'Text channel', value: textChannel ? channelMention(textChannel.id) : '_none_', inline: true },
      { name: 'Voice channel', value: voiceChannel ? channelMention(voiceChannel.id) : '_none_', inline: true },
      { name: 'Color', value: role.hexColor, inline: true },
    ];

    await interaction.editReply(embeds.success({ title: role.name, description: `Info for ${role.name}` }, fields));
  },
};
