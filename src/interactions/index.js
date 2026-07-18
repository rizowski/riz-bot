import { MessageFlags } from 'discord.js';
import logger from '@local/logger';
import { cmds } from './all.js';

export const autocomplete = async (interaction) => {
  const cmd = cmds.find((c) => c.trigger(interaction));

  try {
    if (cmd?.autocomplete) {
      await cmd.autocomplete(interaction);
    } else {
      await interaction.respond([]);
    }
  } catch (error) {
    logger.error(error);
  }
};

export const run = async (interaction, client) => {
  logger.info({
    id: interaction.commandId,
    command: `/${interaction.commandName} ${interaction.options.getSubcommand(false) ?? ''}`.trim(),
  });

  const cmd = cmds.find((c) => c.trigger(interaction));

  if (!cmd) {
    await interaction.reply({
      content: `Command \`/${interaction.commandName}\` has not been implemented yet.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferReply(cmd.ephemeral ? { flags: MessageFlags.Ephemeral } : {});

  try {
    await cmd.action(interaction, client);
  } catch (error) {
    logger.error(error);
    await interaction.editReply({ content: `Something failed. ||${error.message}||` });
  }
};
