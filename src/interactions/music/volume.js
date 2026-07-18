import { embeds } from '@local/responses';
import { musicSubcommand, requireSession } from './shared.js';

export default {
  trigger: musicSubcommand('volume'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    const percent = interaction.options.getInteger('percent');
    session.setVolume(percent);
    await interaction.editReply(embeds.success({ title: 'Volume', description: `Volume set to ${percent}%` }));
  },
};
