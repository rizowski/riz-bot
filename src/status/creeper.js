import { ActivityType } from 'discord.js';

// Idle gamers left the game running and walked away — not worth creeping on.
const ACTIVE_STATUSES = new Set(['online', 'dnd']);

// userId -> { name, game }
const gamers = new Map();

export function hasGamers() {
  return gamers.size > 0;
}

export function randomTarget() {
  if (gamers.size === 0) {
    return null;
  }

  const targets = [...gamers.values()];

  return targets[Math.floor(Math.random() * targets.length)];
}

export function trackPresence({ id, bot, displayName, activities, status }) {
  if (bot) {
    return;
  }

  const playing = activities?.find((a) => a.type === ActivityType.Playing);

  if (playing && ACTIVE_STATUSES.has(status)) {
    gamers.set(id, { name: displayName, game: playing.name });
  } else {
    gamers.delete(id);
  }
}

export function reset() {
  gamers.clear();
}
