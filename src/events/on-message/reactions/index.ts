import { percentage } from '../../../utils/math';
import emoji from '../../../emojis';

function getReaction(): string | null {
  const percent = percentage();

  if (percent <= 0.001) {
    return emoji.gKappa;
  }

  return null;
}

export async function subscribe(msg: any): Promise<void> {
  const reaction = getReaction();

  if (reaction) {
    await msg.react(reaction);
  }
}
