import { embeds } from '@local/responses';
import { musicSubcommand, requireSession } from './shared.js';

export default {
  trigger: musicSubcommand('resume'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    session.resume();
    await interaction.editReply(
      embeds.success({ title: 'Resumed', description: `Back to **${session.current.title}**` })
    );
  },
};
