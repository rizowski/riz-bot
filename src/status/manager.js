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
// alternating between creeping on a gamer (when there is one) and the
// next command hint — so hints still get airtime on a busy server.
export function createStatusManager({ setActivity, intervalMs = FIVE_MINUTES }) {
  let timer = null;
  let index = 0;
  let music = null;
  let creep = null;
  let creepTurn = true;
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

  const rotate = () => {
    if (creep && creepTurn) {
      show('creep', creep);
    } else {
      show('hint', HINTS[index % HINTS.length]);
      index++;
    }

    creepTurn = !creepTurn;
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
    setCreeping(text) {
      if (creep === text) {
        return;
      }

      creep = text;

      if (!music) {
        // A new (or changed) target shows immediately, then alternation resumes.
        creepTurn = true;
        startRotation();
      }
    },
    clearCreeping() {
      if (!creep) {
        return;
      }

      const wasShowingCreep = lastShown === creep;
      creep = null;

      if (!music && wasShowingCreep) {
        creepTurn = false;
        startRotation();
      }
    },
    stop: stopTimer,
  };
}
