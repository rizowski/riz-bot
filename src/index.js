import config from 'config';
import logger from '@local/logger';
import * as discord from '@local/discord';
import * as interactions from './interactions/index.js';
import { definitions } from './interactions/all.js';

discord.onReady(async (client) => {
  const guild = await client.guilds.fetch(config.discord.guildId);
  await guild.commands.set(definitions);
  logger.info({
    message: 'Registered application commands',
    count: definitions.length,
    guild: guild.name,
  });
});

discord.onInteraction(async (interaction, client) => {
  if (interaction.isAutocomplete()) {
    await interactions.autocomplete(interaction);
    return;
  }

  try {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    await interactions.run(interaction, client);
  } catch (error) {
    logger.error(error);
    const payload = { content: `Something failed. ||${error.message}||` };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  }
});

discord.login(config.discord.token);
