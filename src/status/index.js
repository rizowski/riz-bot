import logger from '@local/logger';
import { createStatusManager } from './manager.js';
import { hasGamers, randomTarget, trackPresence } from './creeper.js';

let manager = null;

const VERBS = ['👀 Creeping on', '📺 Watching'];

function getCreep() {
  const target = randomTarget();

  if (!target) {
    return null;
  }

  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];

  return `${verb} ${target.name} playing ${target.game}`;
}

export function init(client) {
  manager = createStatusManager({
    getCreep,
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

  const before = hasGamers();

  trackPresence({
    id: member.id,
    bot: member.user.bot,
    displayName: member.displayName,
    activities: presence.activities,
    status: presence.status,
  });

  const after = hasGamers();

  if (!before && after) {
    manager?.creepStarted();
  } else if (before && !after) {
    manager?.creepEnded();
  }
}
