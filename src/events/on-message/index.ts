import { merge } from 'rxjs/observable/merge';
import { Observable } from 'rxjs';
import { Message } from 'discord.js';
import config from 'config';
import * as reactions from './reactions';
import * as commands from './on-command';

export function onMessage(message: Observable<Message>): Observable<Message> {
  const reacts = message.flatMap(reactions.subscribe);
  const command = message
    .throttleTime(750)
    .filter((message) => {
      // @ts-ignore
      return message.content.startsWith(config.token) && !message.author.bot && !message.author.lastMessage.system;
    })
    .flatMap(commands.subscribe);

  return merge(reacts, command);
}
