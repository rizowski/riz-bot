import { embeds } from '@local/responses';
import { formatTime, progressBar } from '../../music/format.js';
import { musicSubcommand, requireSession } from './shared.js';

export default {
  trigger: musicSubcommand('nowplaying'),
  ephemeral: false,
  async action(interaction) {
    const session = await requireSession(interaction);

    if (!session) {
      return;
    }

    const track = session.current;
    const elapsed = (session.resource?.playbackDuration ?? 0) / 1000;
    const total = track.duration;

    const timeline =
      total > 0
        ? `\`${formatTime(elapsed)}\` ${progressBar(elapsed, total)} \`${formatTime(total)}\``
        : `\`${formatTime(elapsed)}\` ${progressBar(elapsed, 0)}`;

    const upNext = session.queue.size;
    const footer =
      upNext > 0 ? `\n${upNext} track${upNext === 1 ? '' : 's'} up next — \`/music queue\` to see them` : '';

    await interaction.editReply(
      embeds.success({
        title: 'Now Playing 🎶',
        description: `**${track.title}**\n${timeline}\nVolume: ${session.volume}%${footer}`,
      })
    );
  },
};
