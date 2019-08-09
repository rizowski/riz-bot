import { Observable } from 'rxjs';
import { Message } from 'discord.js';
import config from 'config';
import * as reactions from './reactions';
import * as commands from './on-command';

export function onMessage(message: Observable<Message>): Observable<Message> {
  message.subscribe(reactions.subscribe);

  message
    .throttleTime(750)
    .filter(
      // @ts-ignore
      (message) => message.content.startsWith(config.token) && !message.author.bot && !message.author.lastMessage.system
    )
    .flatMap(commands.subscribe);

  return message;
}
