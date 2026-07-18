import { ActivityType } from 'discord.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { currentTarget, reset, trackPresence } from './creeper.js';

const playing = (game) => [{ type: ActivityType.Playing, name: game }];
const custom = (text) => [{ type: ActivityType.Custom, name: 'Custom Status', state: text }];

beforeEach(() => {
  reset();
});

describe('creeper', () => {
  it('tracks a member who starts playing', () => {
    trackPresence({ id: '1', bot: false, displayName: 'rizo', activities: playing('DOOM') });

    expect(currentTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });

  it('prefers the most recent game-starter', () => {
    trackPresence({ id: '1', bot: false, displayName: 'rizo', activities: playing('DOOM') });
    trackPresence({ id: '2', bot: false, displayName: 'zack', activities: playing('Factorio') });

    expect(currentTarget()).toEqual({ name: 'zack', game: 'Factorio' });
  });

  it('falls back to another gamer when the target stops', () => {
    trackPresence({ id: '1', bot: false, displayName: 'rizo', activities: playing('DOOM') });
    trackPresence({ id: '2', bot: false, displayName: 'zack', activities: playing('Factorio') });
    trackPresence({ id: '2', bot: false, displayName: 'zack', activities: [] });

    expect(currentTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });

  it('returns null when nobody is playing', () => {
    trackPresence({ id: '1', bot: false, displayName: 'rizo', activities: playing('DOOM') });
    trackPresence({ id: '1', bot: false, displayName: 'rizo', activities: custom('afk') });

    expect(currentTarget()).toBeNull();
  });

  it('ignores bots and non-game activities', () => {
    trackPresence({ id: '9', bot: true, displayName: 'beep', activities: playing('Botting') });
    trackPresence({ id: '1', bot: false, displayName: 'rizo', activities: custom('vibing') });

    expect(currentTarget()).toBeNull();
  });
});
