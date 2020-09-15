import { Message } from 'discord.js';
import { percentage } from '../../../utils/math';
import emoji from '../../../emojis';

export async function subscribe(message: Message): Promise<void> {
  const percent = percentage();

  if (percent <= 0.001) {
    await message.react(emoji.gKappa);
  }

  if (message.author.id === '108568431053246464' && percent <= 0.01) {
    await message.react(emoji.gZack);
  }
}
