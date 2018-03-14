

const Discord = require('discord.js');
const { Observable } = require('rxjs');

const settings = require('./settings');
const logger = require('./logger');

settings.createConfig();

const config = require('config').get('discord');
const client = new Discord.Client();

client.on('ready', () => {
  logger.log({ message: 'Logged in', who: client.user.tag, guildCount: client.guilds.size, userCount: client.users.size });
});

client.on('debug', logger.debug);

const message = Observable.fromEvent(client, 'message');
const error = Observable.fromEvent(client, 'error');

error.subscribe((message) => {
  logger.error({ message });
});

client.login(config.token)
  .catch((e) => {
    logger.error({ message: 'Failed to login', error: e.message });
  });

module.exports = {
  client,
  message,
  error
};
