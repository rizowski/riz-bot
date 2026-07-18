import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HINTS, createStatusManager } from './manager.js';

const CREEP = '👀 Creeping on rizo playing DOOM';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function lastState(setActivity) {
  return setActivity.mock.calls.at(-1)[0].state;
}

function makeManager(getCreep = () => null) {
  const setActivity = vi.fn();
  const manager = createStatusManager({ setActivity, getCreep, intervalMs: 1000 });

  return { setActivity, manager };
}

describe('status manager', () => {
  it('rotates hints when nobody is gaming', () => {
    const { setActivity, manager } = makeManager();

    manager.start();

    expect(lastState(setActivity)).toBe(HINTS[0]);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[1]);
    manager.stop();
  });

  it('wraps around the hint list', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    vi.advanceTimersByTime(1000 * HINTS.length);

    expect(lastState(setActivity)).toBe(HINTS[0]);
    manager.stop();
  });

  it('alternates between creeping and hints while gamers are around', () => {
    const { setActivity, manager } = makeManager(() => CREEP);

    manager.start();

    expect(lastState(setActivity)).toBe(CREEP);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[0]);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(CREEP);
    manager.stop();
  });

  it('asks for a fresh creep target every creep slot', () => {
    const getCreep = vi.fn(() => CREEP);
    const { manager } = makeManager(getCreep);

    manager.start();
    vi.advanceTimersByTime(4000);

    expect(getCreep.mock.calls.length).toBeGreaterThanOrEqual(2);
    manager.stop();
  });

  it('setPlaying pins the jam status over the rotation', () => {
    const { setActivity, manager } = makeManager(() => CREEP);

    manager.start();
    manager.setPlaying('the-lounge');

    expect(lastState(setActivity)).toBe('🎶 Jamming out in #the-lounge');

    const calls = setActivity.mock.calls.length;
    vi.advanceTimersByTime(5000);

    expect(setActivity).toHaveBeenCalledTimes(calls);
    manager.stop();
  });

  it('creepStarted shows a creep immediately', () => {
    let target = null;
    const { setActivity, manager } = makeManager(() => target);

    manager.start();

    expect(lastState(setActivity)).toBe(HINTS[0]);

    target = CREEP;
    manager.creepStarted();

    expect(lastState(setActivity)).toBe(CREEP);
    manager.stop();
  });

  it('creepEnded moves off a stale creep immediately', () => {
    let target = CREEP;
    const { setActivity, manager } = makeManager(() => target);

    manager.start();

    expect(lastState(setActivity)).toBe(CREEP);

    target = null;
    manager.creepEnded();

    expect(HINTS).toContain(lastState(setActivity));
    manager.stop();
  });

  it('creepEnded does nothing while a hint is showing', () => {
    let target = CREEP;
    const { setActivity, manager } = makeManager(() => target);

    manager.start();
    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[0]);

    const calls = setActivity.mock.calls.length;
    target = null;
    manager.creepEnded();

    expect(setActivity).toHaveBeenCalledTimes(calls);
    manager.stop();
  });
});
