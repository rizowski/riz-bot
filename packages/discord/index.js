const { Client, Intents } = require('discord.js');
const logger = require('@local/logger');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.on('ready', () => {
  logger.info({
    message: 'Logged in',
    who: client.user.tag,
    guildCount: client.guilds.size,
    userCount: client.users.size,
  });
});

client.on('warn', (str) => {
  logger.warn(str);
});
client.on('error', (err) => {
  logger.error(err);
});
client.on('debug', (str) => {
  logger.debug(str);
});

exports.shutdown = async () => {
  client.removeAllListeners();
  await client.destroy();
};

exports.login = async (token) => {
  try {
    await client.login(token);
    process.on('exit', exports.shutdown);
  } catch (error) {
    logger.error(error);
  }
};

const interactionTypes = {
  APPLICATION_COMMAND: 2,
  PING: 1,
};

Object.entries(interactionTypes).forEach(([k, v]) => {
  interactionTypes[v] = k;
});

exports.onInteraction = (callback) => {
  client.on('interactionCreate', (data) => {
    callback(data, client);
  });
};

exports.onCommand = (callback) => {
  client.on('message', (msg) => {
    if (msg.content.startsWith('!') && !msg.author.bot && msg.guild) {
      callback(msg, msg.content.replace('!', ''), client);
    }
  });
};
