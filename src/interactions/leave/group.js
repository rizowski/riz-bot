import { roleMention } from 'discord.js';
import { embeds } from '@local/responses';
import { GROUP_PREFIX, resolveGroupRole, respondWithGroups } from '../groups.js';

export default {
  trigger(interaction) {
    return interaction.commandName === 'leave' && interaction.options.getSubcommand() === 'group';
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

    await member.roles.remove(role.id, 'User requested');

    await interaction.editReply({ content: `Successfully left ${roleMention(role.id)}` });
  },
};
