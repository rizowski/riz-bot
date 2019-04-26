const config = require('config').get('discord');
const { Client } = require('discord.js');
const { Observable } = require('rxjs');

const logger = require('../logger');

const client = new Client();

const ready = Observable.fromEvent(client, 'ready');
const debug = Observable.fromEvent(client, 'debug');
const message = Observable.fromEvent(client, 'message');
const error = Observable.fromEvent(client, 'error');
const warn = Observable.fromEvent(client, 'warn');

function shutdown() {
  client.removeAllListeners();
  client.destroy();
}

async function internalLogin() {
  try {
    await client.login(config.token);

    process.on('exit', shutdown);
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to login', { error: error.message });
  }
}
const login = Observable.fromPromise(internalLogin());

module.exports = {
  login,
  client,
  message,
  error,
  debug,
  ready,
  warn,
};
