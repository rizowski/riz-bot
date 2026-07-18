import { embeds } from '@local/responses';
import { musicSubcommand, requireSession } from './shared.js';

export default {
  trigger: musicSubcommand('pause'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    session.pause();
    await interaction.editReply(
      embeds.success({ title: 'Paused', description: `Paused **${session.current.title}**` })
    );
  },
};
