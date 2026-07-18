import { embeds } from '@local/responses';
import { musicSubcommand, requireSession } from './shared.js';

const MAX_LISTED = 20;

export default {
  trigger: musicSubcommand('queue'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    const upNext = session.queue.toArray();
    const lines = upNext.slice(0, MAX_LISTED).map((track, index) => `${index + 1}) ${track.title}`);

    if (upNext.length > MAX_LISTED) {
      lines.push(`...and ${upNext.length - MAX_LISTED} more`);
    }

    const description = [
      `**Now playing:** ${session.current.title}`,
      lines.length > 0 ? `\`\`\`\n${lines.join('\n')}\n\`\`\`` : '_The queue is empty._',
    ].join('\n');

    await interaction.editReply(embeds.success({ title: 'Queue', description }));
  },
};
