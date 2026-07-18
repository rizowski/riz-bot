import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType } from 'discord.js';
import { embeds } from '@local/responses';
import { togglers } from '../../shitpost/users.js';
import { GROUP_PREFIX, resolveGroupRole, respondWithGroups } from '../groups.js';
import { subcommand } from '../shared.js';

const CONFIRM_ID = 'group-remove-confirm';
const CANCEL_ID = 'group-remove-cancel';
const CONFIRM_WINDOW_MS = 30_000;

async function removeGroup(guild, role, reason) {
  const groupName = role.name;
  const channelName = groupName.replace(GROUP_PREFIX, '').toLowerCase();

  const textChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildText);
  const voiceChannel = guild.channels.cache.find((c) => c.name === channelName && c.type === ChannelType.GuildVoice);
  const category = guild.channels.cache.find(
    (c) => c.name.toLowerCase() === groupName.toLowerCase() && c.type === ChannelType.GuildCategory
  );

  const removed = [];

  for (const [label, target] of [
    ['text channel', textChannel],
    ['voice channel', voiceChannel],
    ['category', category],
  ]) {
    if (target) {
      await target.delete(reason);
      removed.push(label);
    }
  }

  await role.delete(reason);
  removed.push('role');

  return removed;
}

export default {
  trigger: subcommand('group', 'remove'),
  ephemeral: true,
  autocomplete: respondWithGroups,
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

    const { guild } = interaction;
    const role = resolveGroupRole(guild, interaction.options.getString('role'));

    if (!role) {
      await interaction.editReply(
        embeds.error({
          title: 'Invalid Role',
          description: `Must specify a group that starts with \`@${GROUP_PREFIX}\` — try the autocomplete suggestions.`,
        })
      );
      return;
    }

    const groupName = role.name;

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(CONFIRM_ID).setLabel('Delete it').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(CANCEL_ID).setLabel('Cancel').setStyle(ButtonStyle.Secondary)
    );

    const message = await interaction.editReply({
      ...embeds.error({
        title: `Delete ${groupName}?`,
        description: 'This permanently deletes the role, category, and channels — message history included.',
      }),
      components: [buttons],
    });

    let confirmation;

    try {
      confirmation = await message.awaitMessageComponent({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === interaction.user.id,
        time: CONFIRM_WINDOW_MS,
      });
    } catch {
      await interaction.editReply({
        ...embeds.error({ title: 'Timed out', description: `Took too long — \`${groupName}\` lives on.` }),
        components: [],
      });
      return;
    }

    if (confirmation.customId !== CONFIRM_ID) {
      await confirmation.update({
        ...embeds.success({ title: 'Cancelled', description: `\`${groupName}\` lives on. 😌` }),
        components: [],
      });
      return;
    }

    await confirmation.deferUpdate();

    const reason = `Group ${groupName} removed by ${interaction.user.username}`;
    const removed = await removeGroup(guild, role, reason);

    await interaction.editReply({
      ...embeds.success({
        title: 'Group removed',
        description: `Deleted \`${groupName}\`: ${removed.join(', ')}. 🧹`,
      }),
      components: [],
    });
  },
};
