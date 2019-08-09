import { Observable } from 'rxjs';
import { Message } from 'discord.js';
import { onMessage } from './on-message';

export function register(message: Observable<Message>): Observable<Message> {
  return onMessage(message);
}
