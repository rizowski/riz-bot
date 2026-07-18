import logger from '@local/logger';
import { createStatusManager } from './manager.js';

let manager = null;

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

  manager.setIdle();
}

export function setPlaying(channelName) {
  manager?.setPlaying(channelName);
}

export function setIdle() {
  manager?.setIdle();
}
