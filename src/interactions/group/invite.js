import { ChannelType, channelMention, roleMention, userMention } from 'discord.js';
import { embeds } from '@local/responses';
import { GROUP_PREFIX, resolveGroupRole, respondWithGroups } from '../groups.js';
import { subcommand } from '../shared.js';

export default {
  trigger: subcommand('group', 'invite'),
  ephemeral: true,
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

    if (!interaction.member.roles.cache.has(role.id)) {
      await interaction.editReply(
        embeds.error({
          title: 'Members only',
          description: `You can only invite people to groups you're in. Join ${roleMention(role.id)} first.`,
        })
      );
      return;
    }

    const target = interaction.options.getMember('user');

    if (!target) {
      await interaction.editReply(
        embeds.error({
          title: 'Who?',
          description: `I can't find that person in this server. 👁👄👁`,
        })
      );
      return;
    }

    if (target.user.bot) {
      await interaction.editReply(
        embeds.error({
          title: 'Nice try',
          description: 'Bots have enough group chats already. 🤖',
        })
      );
      return;
    }

    if (target.roles.cache.has(role.id)) {
      await interaction.editReply(
        embeds.error({
          title: 'Already in',
          description: `${userMention(target.id)} is already in ${roleMention(role.id)}. 😐 awk...`,
        })
      );
      return;
    }

    await target.roles.add(role.id, `Invited by ${interaction.user.username}`);

    const channelName = role.name.replace(GROUP_PREFIX, '').toLowerCase();
    const textChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildText);

    if (textChannel) {
      await textChannel.send(
        `Hey ${userMention(target.id)}! ${userMention(interaction.user.id)} invited you to the group. Welcome. 🎉`
      );
      await interaction.editReply({
        content: `Invited ${userMention(target.id)} to ${channelMention(textChannel.id)}`,
      });
      return;
    }

    await interaction.editReply({ content: `Invited ${userMention(target.id)} to \`@${role.name}\`` });
  },
};
