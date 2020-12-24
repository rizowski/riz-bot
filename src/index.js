const config = require('config');
const discord = require('@local/discord');
const interactions = require('./interactions');

discord.login(config.discord.token);

discord.onInteraction(async (data, client) => {
  try {
    await interactions.run(data, client);
  } catch (error) {
    console.error(error);
  }
});
