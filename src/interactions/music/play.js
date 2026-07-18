import { embeds } from '@local/responses';
import { getSession } from '../../music/player.js';
import { resolveTracks } from '../../music/ytdlp.js';
import { musicSubcommand } from './shared.js';

export default {
  trigger: musicSubcommand('play'),
  ephemeral: false,
  async action(interaction) {
    const voiceChannel = interaction.member?.voice?.channel;

    if (!voiceChannel) {
      await interaction.editReply(
        embeds.error({
          title: 'Not so fast',
          description: 'You need to be in a voice channel for me to play you sweet things into your ear.',
        })
      );
      return;
    }

    const query = interaction.options.getString('query');
    const tracks = await resolveTracks(query);

    if (tracks.length === 0) {
      await interaction.editReply(
        embeds.error({
          title: 'No song found',
          description: `Nothing turned up for \`${query}\``,
        })
      );
      return;
    }

    const session = getSession(interaction.guild.id);
    await session.connect(voiceChannel);
    session.enqueue(tracks);

    const description =
      tracks.length === 1 ? `Queued **${tracks[0].title}**` : `Queued **${tracks.length}** tracks from that playlist`;

    await interaction.editReply(embeds.success({ title: 'On it 🎶', description }));
  },
};
