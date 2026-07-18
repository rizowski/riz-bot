import { ActivityType } from 'discord.js';

// userId -> { name, game }, insertion-ordered so the most recent
// game-starter is last.
const gamers = new Map();

export function currentTarget() {
  return [...gamers.values()].at(-1) ?? null;
}

export function trackPresence({ id, bot, displayName, activities }) {
  if (bot) {
    return currentTarget();
  }

  const playing = activities?.find((a) => a.type === ActivityType.Playing);
  gamers.delete(id);

  if (playing) {
    gamers.set(id, { name: displayName, game: playing.name });
  }

  return currentTarget();
}

export function reset() {
  gamers.clear();
}
