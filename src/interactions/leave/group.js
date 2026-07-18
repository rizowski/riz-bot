import { roleMention } from 'discord.js';
import { embeds } from '@local/responses';

const prefix = 'g:';

export default {
  trigger(interaction) {
    return interaction.commandName === 'leave' && interaction.options.getSubcommand() === 'group';
  },
  ephemeral: true,
  async action(interaction) {
    const { member } = interaction;
    const role = interaction.options.getRole('role');

    if (!role.name.startsWith(prefix)) {
      await interaction.editReply(
        embeds.error({
          title: 'Invalid Role',
          description: `Must specify a role that starts with \`@${prefix}\``,
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
