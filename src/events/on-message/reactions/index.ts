import { Message } from 'discord.js';
import { percentage } from '../../../utils/math';
import emoji from '../../../emojis';

export async function subscribe(msg: Message): Promise<void> {
  const percent = percentage();

  if (percent <= 0.001) {
    await msg.react(emoji.gKappa);
  }

  if (msg.author.id === '108568431053246464' && percent <= 0.01) {
    await msg.react(emoji.gZack);
  }
}
