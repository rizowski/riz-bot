import { ActivityType } from 'discord.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { currentTarget, reset, trackPresence } from './creeper.js';

const playing = (game) => [{ type: ActivityType.Playing, name: game }];
const custom = (text) => [{ type: ActivityType.Custom, name: 'Custom Status', state: text }];

function present({ id, name, activities, status = 'online', bot = false }) {
  return trackPresence({ id, bot, displayName: name, activities, status });
}

beforeEach(() => {
  reset();
});

describe('creeper', () => {
  it('tracks a member who starts playing', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });

    expect(currentTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });

  it('prefers the most recent game-starter', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });
    present({ id: '2', name: 'zack', activities: playing('Factorio') });

    expect(currentTarget()).toEqual({ name: 'zack', game: 'Factorio' });
  });

  it('falls back to another gamer when the target stops', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });
    present({ id: '2', name: 'zack', activities: playing('Factorio') });
    present({ id: '2', name: 'zack', activities: [] });

    expect(currentTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });

  it('returns null when nobody is playing', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });
    present({ id: '1', name: 'rizo', activities: custom('afk') });

    expect(currentTarget()).toBeNull();
  });

  it('ignores bots and non-game activities', () => {
    present({ id: '9', name: 'beep', activities: playing('Botting'), bot: true });
    present({ id: '1', name: 'rizo', activities: custom('vibing') });

    expect(currentTarget()).toBeNull();
  });

  it('does not creep on idle gamers', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM'), status: 'idle' });

    expect(currentTarget()).toBeNull();
  });

  it('drops a tracked gamer who goes idle and falls back', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });
    present({ id: '2', name: 'zack', activities: playing('Factorio') });
    present({ id: '2', name: 'zack', activities: playing('Factorio'), status: 'idle' });

    expect(currentTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });

  it('still creeps on do-not-disturb gamers', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM'), status: 'dnd' });

    expect(currentTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });
});
