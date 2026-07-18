import { embeds } from '@local/responses';
import { isEnabled } from '../../shitpost/state.js';

const ADULT_ROLE_ID = '436193265327407107';

function funCmd(subcommand, action) {
  return {
    trigger(interaction) {
      return interaction.commandName === 'shitpost' && interaction.options.getSubcommand() === subcommand;
    },
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
  await interaction.editReply(`<@&${ADULT_ROLE_ID}>`);
  await interaction.channel.send('👁 👁\n       👄\n🤜  🤛');
});

export const mufasa = funCmd('mufasa', async (interaction) => {
  await interaction.editReply('https://www.youtube.com/watch?v=1AnG04qnLqI');
});
