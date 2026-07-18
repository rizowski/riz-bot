import { isEnabled } from './state.js';
import { isUrl } from './lib.js';
import { runTriggers } from './triggers.js';

export async function handleMessage(message) {
  if (!isEnabled() || message.author.bot || !message.guild || isUrl(message.content)) {
    return;
  }

  await runTriggers(message);
}
