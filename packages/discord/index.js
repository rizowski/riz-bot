const { Client } = require('discord.js');
const logger = require('@local/logger');

const client = new Client();

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
  let removed = false;
  const wsListener = client.ws.on('INTERACTION_CREATE', async (data) => {
    const guild = client.guilds?.cache.get(data.guild_id);
    const channel = client.channels?.cache.get(data.channel_id);
    const member = await guild?.members.fetch(data.member.user.id);

    const event = {
      id: data.id,
      type: interactionTypes[data.type],
      token: data.token,
      member,
      guild,
      channel,
      data: data.data,
    };

    callback(event, client);
  });

  client.on('interactionCreate', (data) => {
    if (!removed) {
      client.ws.removeListener('INTERACTION_CREATE', wsListener);
    }

    removed = true;

    callback(data, client);
  });
};

exports.onCommand = () => {
  //   client.on('message', (msg) => {
  //     if (msg.content.startsWith('!') && !msg.author.bot && msg.guild) {
  //       callback({ ...msg, content: msg.content.replace('!', '') }, client);
  //     }
  //   });
};
