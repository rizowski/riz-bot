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

/**
 *
 * {
  version: 1,
  type: 2,
  token: 'aW50ZXJhY3Rpb246NzkxNzI3NTAyMTU3ODA3NjM2Ond4bDhvRWJHTUVjc2pUU1dnNjRMM29uYkFmVzV2VVJlSmk3WDRPRnR3amo1STBvbHl5UThkYkJWNUU4bDB2TXcwODM5V1hmTWxKM3R6VWlaNmRoUzBuemhjOFo1YXd5NWNLMjdDRkxVQ0Q0SnVsdDNyQ21kVGlQdHpYQk1abFY2',
  member: {
    user: {
      username: 'Rizowski',
      public_flags: 512,
      id: '100758264047747072',
      discriminator: '2480',
      avatar: '99b668998541cb54ec0a120b7a007c2a'
    },
    roles: [ '293119561056780300', '357933775130198028' ],
    premium_since: null,
    permissions: '2147483647',
    pending: false,
    nick: null,
    mute: false,
    joined_at: '2015-10-08T00:11:39.610000+00:00',
    is_pending: false,
    deaf: false
  },
  id: '791727502157807636',
  guild_id: '101471536719888384',
  data: { name: 'version', id: '791463208657354812' },
  channel_id: '362391722568974336'
}
 */

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
    // console.log(data);
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
  //     console.log('MESSAGE', msg.isMessage, msg.isInteraction, msg.isUser);
  //     if (msg.content.startsWith('!') && !msg.author.bot && msg.guild) {
  //       callback({ ...msg, content: msg.content.replace('!', '') }, client);
  //     }
  //   });
};
