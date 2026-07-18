import { roleMention } from 'discord.js';
import { embeds } from '@local/responses';
import { isEnabled } from '../../shitpost/state.js';
import { roles } from '../../shitpost/users.js';
import { MUFASA_URL } from '../../shitpost/lib.js';
import { subcommand } from '../shared.js';

function funCmd(name, action) {
  return {
    trigger: subcommand('shitpost', name),
    ephemeral: false,
    async action(interaction) {
      if (!isEnabled()) {
        await interaction.editReply(
          embeds.error({ title: 'Shitposting is off', description: 'Someone responsible turned me off. 😇' })
        );
        return;
      }

      await action(interaction);
    },
  };
}

export const hype = funCmd('hype', async (interaction) => {
  await interaction.editReply('https://media.giphy.com/media/b1o4elYH8Tqjm/giphy.gif');
});

export const adult = funCmd('adult', async (interaction) => {
  await interaction.editReply(roleMention(roles.adult));
  await interaction.channel.send('👁 👁\n       👄\n🤜  🤛');
});

export const mufasa = funCmd('mufasa', async (interaction) => {
  await interaction.editReply(MUFASA_URL);
});
