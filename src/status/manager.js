import { ActivityType } from 'discord.js';

export const HINTS = [
  'Try /music play',
  'Try /list groups',
  'Try /join group',
  'Try /create group',
  'Try /emoji add',
  'Try /group info',
  'Try /music nowplaying',
  'Try /shitpost status',
];

const FIVE_MINUTES = 5 * 60 * 1000;

export function createStatusManager({ setActivity, intervalMs = FIVE_MINUTES }) {
  let timer = null;
  let index = 0;

  const applyIdleHint = () => {
    setActivity({ type: ActivityType.Custom, name: 'hint', state: HINTS[index % HINTS.length] });
    index++;
  };

  return {
    // Show rotating command hints; safe to call when already idle.
    setIdle() {
      if (timer) {
        return;
      }

      applyIdleHint();
      timer = setInterval(applyIdleHint, intervalMs);
      timer.unref?.();
    },
    setPlaying(channelName) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }

      setActivity({ type: ActivityType.Custom, name: 'music', state: `🎶 Jamming out in #${channelName}` });
    },
    stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    },
  };
}
