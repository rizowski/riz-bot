import { ActivityType } from 'discord.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hasGamers, randomTarget, reset, trackPresence } from './creeper.js';

const playing = (game) => [{ type: ActivityType.Playing, name: game }];
const custom = (text) => [{ type: ActivityType.Custom, name: 'Custom Status', state: text }];

function present({ id, name, activities, status = 'online', bot = false }) {
  trackPresence({ id, bot, displayName: name, activities, status });
}

beforeEach(() => {
  reset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('creeper', () => {
  it('tracks a member who starts playing', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });

    expect(randomTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });

  it('picks targets at random', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });
    present({ id: '2', name: 'zack', activities: playing('Factorio') });

    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(randomTarget().name).toBe('rizo');

    Math.random.mockReturnValue(0.99);

    expect(randomTarget().name).toBe('zack');
  });

  it('drops a gamer who stops playing', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM') });
    present({ id: '1', name: 'rizo', activities: custom('afk') });

    expect(hasGamers()).toBe(false);
    expect(randomTarget()).toBeNull();
  });

  it('ignores bots and non-game activities', () => {
    present({ id: '9', name: 'beep', activities: playing('Botting'), bot: true });
    present({ id: '1', name: 'rizo', activities: custom('vibing') });

    expect(hasGamers()).toBe(false);
  });

  it('does not creep on idle gamers and drops those who go idle', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM'), status: 'idle' });

    expect(hasGamers()).toBe(false);

    present({ id: '1', name: 'rizo', activities: playing('DOOM') });

    expect(hasGamers()).toBe(true);

    present({ id: '1', name: 'rizo', activities: playing('DOOM'), status: 'idle' });

    expect(hasGamers()).toBe(false);
  });

  it('still creeps on do-not-disturb gamers', () => {
    present({ id: '1', name: 'rizo', activities: playing('DOOM'), status: 'dnd' });

    expect(randomTarget()).toEqual({ name: 'rizo', game: 'DOOM' });
  });
});
