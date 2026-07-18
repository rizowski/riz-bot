import { embeds } from '@local/responses';
import { musicSubcommand, requireSession } from './shared.js';

export default {
  trigger: musicSubcommand('skip'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    const skipped = session.skip();
    await interaction.editReply(embeds.success({ title: 'Skipped', description: `Skipped **${skipped.title}**` }));
  },
};
