import logger from '@local/logger';
import { createStatusManager } from './manager.js';
import { trackPresence } from './creeper.js';

let manager = null;

const VERBS = ['👀 Creeping on', '📺 Watching'];

// Stable per target so presence noise doesn't flip the verb mid-creep.
function creepText({ name, game }) {
  return `${VERBS[(name.length + game.length) % VERBS.length]} ${name} playing ${game}`;
}

export function init(client) {
  manager = createStatusManager({
    setActivity(activity) {
      try {
        client.user.setPresence({ status: 'online', activities: [activity] });
      } catch (error) {
        logger.error(error);
      }
    },
  });

  manager.start();
}

export function setPlaying(channelName) {
  manager?.setPlaying(channelName);
}

export function clearPlaying() {
  manager?.clearPlaying();
}

export function handlePresence(presence) {
  const member = presence?.member;

  if (!member) {
    return;
  }

  const target = trackPresence({
    id: member.id,
    bot: member.user.bot,
    displayName: member.displayName,
    activities: presence.activities,
  });

  if (target) {
    manager?.setCreeping(creepText(target));
  } else {
    manager?.clearCreeping();
  }
}
