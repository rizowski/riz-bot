import { ChannelType } from 'discord.js';
import { embeds } from '@local/responses';
import { togglers } from '../../shitpost/users.js';
import { GROUP_PREFIX, resolveGroupRole, respondWithGroups } from '../groups.js';
import { subcommand } from '../shared.js';

export default {
  trigger: subcommand('group', 'remove'),
  ephemeral: true,
  autocomplete: respondWithGroups,
  async action(interaction) {
    if (!togglers.has(interaction.user.id)) {
      await interaction.editReply(
        embeds.error({
          title: 'Nice try',
          description: "You're not on the list. The list is very exclusive. 🚪",
        })
      );
      return;
    }

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

    const groupName = role.name;
    const channelName = role.name.replace(GROUP_PREFIX, '').toLowerCase();
    const reason = `Group ${groupName} removed by ${interaction.user.username}`;

    const textChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildText);
    const voiceChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildVoice);
    const category = guild.channels.cache.find(
      (c) => c.name.toLowerCase() === groupName.toLowerCase() && c.type === ChannelType.GuildCategory
    );

    const removed = [];

    for (const [label, target] of [
      ['text channel', textChannel],
      ['voice channel', voiceChannel],
      ['category', category],
    ]) {
      if (target) {
        await target.delete(reason);
        removed.push(label);
      }
    }

    await role.delete(reason);
    removed.push('role');

    await interaction.editReply(
      embeds.success({
        title: 'Group removed',
        description: `Deleted \`${groupName}\`: ${removed.join(', ')}. 🧹`,
      })
    );
  },
};
