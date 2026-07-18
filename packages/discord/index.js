import { Client, Events, GatewayIntentBits } from 'discord.js';
import logger from '@local/logger';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on(Events.ClientReady, () => {
  logger.info({
    message: 'Logged in',
    who: client.user.tag,
    guildCount: client.guilds.cache.size,
    userCount: client.users.cache.size,
  });
});

client.on(Events.Warn, (str) => {
  logger.warn(str);
});
client.on(Events.Error, (err) => {
  logger.error(err);
});
client.on(Events.Debug, (str) => {
  logger.debug(str);
});

export const shutdown = async () => {
  client.removeAllListeners();
  await client.destroy();
};

export const login = async (token) => {
  try {
    await client.login(token);
    process.on('exit', shutdown);
  } catch (error) {
    logger.error(error);
  }
};

export const onReady = (callback) => {
  client.once(Events.ClientReady, () => {
    callback(client);
  });
};

export const onInteraction = (callback) => {
  client.on(Events.InteractionCreate, (interaction) => {
    callback(interaction, client);
  });
};
