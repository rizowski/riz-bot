import { ActivityType } from 'discord.js';

// Idle gamers left the game running and walked away — not worth creeping on.
const ACTIVE_STATUSES = new Set(['online', 'dnd']);

// userId -> { name, game }, insertion-ordered so the most recent
// game-starter is last.
const gamers = new Map();

export function currentTarget() {
  return [...gamers.values()].at(-1) ?? null;
}

export function trackPresence({ id, bot, displayName, activities, status }) {
  if (bot) {
    return currentTarget();
  }

  const playing = activities?.find((a) => a.type === ActivityType.Playing);
  gamers.delete(id);

  if (playing && ACTIVE_STATUSES.has(status)) {
    gamers.set(id, { name: displayName, game: playing.name });
  }

  return currentTarget();
}

export function reset() {
  gamers.clear();
}
