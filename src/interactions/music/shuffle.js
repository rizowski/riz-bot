import { embeds } from '@local/responses';
import { musicSubcommand, requireSession } from './shared.js';

export default {
  trigger: musicSubcommand('shuffle'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    session.queue.shuffle();
    await interaction.editReply(
      embeds.success({ title: 'Shuffled', description: `Shuffled ${session.queue.size} queued tracks. 🔀` })
    );
  },
};
