import config from 'config';
import logger from '@local/logger';
import * as discord from '@local/discord';
import * as interactions from './interactions/index.js';
import { definitions } from './interactions/all.js';
import * as shitpost from './shitpost/index.js';
import * as status from './status/index.js';

discord.onReady(async (client) => {
  const guild = await client.guilds.fetch(config.discord.guildId);
  await guild.commands.set(definitions);
  logger.info({
    message: 'Registered application commands',
    count: definitions.length,
    guild: guild.name,
  });

  for (const presence of guild.presences.cache.values()) {
    status.handlePresence(presence);
  }

  status.init(client);
});

discord.onPresenceUpdate((presence) => {
  try {
    status.handlePresence(presence);
  } catch (error) {
    logger.error(error);
  }
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

discord.onMessage(async (message) => {
  try {
    await shitpost.handleMessage(message);
  } catch (error) {
    logger.error(error);
  }
});

discord.login(config.discord.token);
