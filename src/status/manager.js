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

// Music pins the status. Otherwise the status rotates on the interval,
// alternating between creeping (getCreep supplies a fresh target each
// slot) and the next command hint, so hints still get airtime.
export function createStatusManager({ setActivity, getCreep = () => null, intervalMs = FIVE_MINUTES }) {
  let timer = null;
  let index = 0;
  let music = null;
  let creepTurn = true;
  let lastName = null;
  let lastShown = null;

  const show = (name, state) => {
    if (state === lastShown) {
      return;
    }

    lastName = name;
    lastShown = state;
    setActivity({ type: ActivityType.Custom, name, state });
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const rotate = () => {
    if (creepTurn) {
      const creep = getCreep();

      if (creep) {
        show('creep', creep);
        creepTurn = false;
        return;
      }
    }

    show('hint', HINTS[index % HINTS.length]);
    index++;
    creepTurn = true;
  };

  const startRotation = () => {
    stopTimer();
    rotate();
    timer = setInterval(rotate, intervalMs);
    timer.unref?.();
  };

  const apply = () => {
    if (music) {
      stopTimer();
      show('music', music);
      return;
    }

    if (!timer) {
      startRotation();
    }
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
    // The first gamer appeared — creep right away instead of waiting a slot.
    creepStarted() {
      if (!music) {
        creepTurn = true;
        startRotation();
      }
    },
    // The last gamer left — move off a stale creep immediately.
    creepEnded() {
      if (!music && lastName === 'creep') {
        startRotation();
      }
    },
    stop: stopTimer,
  };
}
