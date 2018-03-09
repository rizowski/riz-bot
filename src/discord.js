'use strict';

const Discord = require("discord.js");
const { Observable } = require('rxjs');

const de = require('debug');
const settings = require('./settings');

settings.createConfig();

const config = require('config').get('discord');
const client = new Discord.Client();
const logger = {
  debug: de('riz'),
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} on ${ client.guilds.size } servers with ${ client.users.size } others!`);
});

client.on('debug', logger.debug);

const message = Observable.fromEvent(client, 'message');
const error = Observable.fromEvent(client, 'error');

error.subscribe((message) => {
  console.log(message);
});

client.login(config.token)
  .catch((e) => {
    console.error('[error]', e.message);
  });

module.exports = {
  client,
  message,
  error
};
