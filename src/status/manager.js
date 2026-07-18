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

// Status layers, highest priority first: music > creeping > rotating hints.
export function createStatusManager({ setActivity, intervalMs = FIVE_MINUTES }) {
  let timer = null;
  let index = 0;
  let music = null;
  let creep = null;
  let lastShown = null;

  const show = (name, state) => {
    if (state === lastShown) {
      return;
    }

    lastShown = state;
    setActivity({ type: ActivityType.Custom, name, state });
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const applyIdleHint = () => {
    show('hint', HINTS[index % HINTS.length]);
    index++;
  };

  const apply = () => {
    const pinned = music ?? creep;

    if (pinned) {
      stopTimer();
      show(music ? 'music' : 'creep', pinned);
      return;
    }

    if (timer) {
      return;
    }

    applyIdleHint();
    timer = setInterval(applyIdleHint, intervalMs);
    timer.unref?.();
  };

  return {
    start: apply,
    setPlaying(channelName) {
      music = `🎶 Jamming out in #${channelName}`;
      apply();
    },
    clearPlaying() {
      music = null;
      apply();
    },
    setCreeping(text) {
      creep = text;

      if (!music) {
        apply();
      }
    },
    clearCreeping() {
      creep = null;

      if (!music) {
        apply();
      }
    },
    stop: stopTimer,
  };
}
