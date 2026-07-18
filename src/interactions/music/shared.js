import { embeds } from '@local/responses';
import { findSession } from '../../music/player.js';
import { subcommand } from '../shared.js';

export function musicSubcommand(name) {
  return subcommand('music', name);
}

export async function requireSession(interaction) {
  const session = findSession(interaction.guild.id);

  if (!session || !session.current) {
    await interaction.editReply(
      embeds.error({
        title: 'Nothing is playing',
        description: 'Start something with `/music play` first.',
      })
    );

    return null;
  }

  return session;
}
