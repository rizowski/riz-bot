import { embeds } from '@local/responses';
import { musicSubcommand, requireSession } from './shared.js';

export default {
  trigger: musicSubcommand('stop'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    session.stop();
    await interaction.editReply(
      embeds.success({ title: 'Stopped', description: 'Cleared the queue and left the channel. 👋' })
    );
  },
};
