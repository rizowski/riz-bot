import { discord as config } from 'config';
import { Client, Message } from 'discord.js';
import { Observable } from 'rxjs';
import logger from '../logger';

export const client: Client = new Client();

export const ready = Observable.fromEvent(client, 'ready');
export const debug = Observable.fromEvent(client, 'debug');
export const message: Observable<Message> = Observable.fromEvent(client, 'message');
export const error = Observable.fromEvent(client, 'error');
export const warn = Observable.fromEvent(client, 'warn');

function shutdown(): void {
  client.removeAllListeners();
  client.destroy();
}

async function internalLogin(): Promise<void> {
  try {
    await client.login(config.token);

    process.on('exit', shutdown);
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to login', { error: error.message });
  }
}

export const login = Observable.fromPromise(internalLogin());
