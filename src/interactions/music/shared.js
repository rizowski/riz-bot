import { embeds } from '@local/responses';
import { findSession } from '../../music/player.js';

export function musicSubcommand(name) {
  return (interaction) => interaction.commandName === 'music' && interaction.options.getSubcommand() === name;
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
