import { embeds } from '@local/responses';
import { isEnabled, setEnabled } from '../../shitpost/state.js';
import { togglers } from '../../shitpost/users.js';
import { subcommand } from '../shared.js';

function toggleCmd(name, value, description) {
  return {
    trigger: subcommand('shitpost', name),
    ephemeral: false,
    async action(interaction) {
      if (!togglers.has(interaction.user.id)) {
        await interaction.editReply(
          embeds.error({
            title: 'Nice try',
            description: "You're not on the list. The list is very exclusive. 🚪",
          })
        );
        return;
      }

      setEnabled(value);
      await interaction.editReply(embeds.success({ title: 'Shitposting', description }));
    },
  };
}

export const on = toggleCmd('on', true, 'Chaos restored. 😈');
export const off = toggleCmd('off', false, 'Fine. Being normal now. 😇');

export const status = {
  trigger: subcommand('shitpost', 'status'),
  ephemeral: true,
  async action(interaction) {
    await interaction.editReply(
      embeds.success({
        title: 'Shitpost status',
        description: isEnabled() ? 'ON — chaos reigns. 😈' : 'OFF — unbearably civilized. 😇',
      })
    );
  },
};
