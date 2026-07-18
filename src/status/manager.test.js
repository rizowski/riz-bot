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

function makeManager() {
  const setActivity = vi.fn();
  const manager = createStatusManager({ setActivity, intervalMs: 1000 });

  return { setActivity, manager };
}

describe('status manager', () => {
  it('shows a hint immediately and rotates on the interval', () => {
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

  it('setPlaying shows the jam status and pauses the rotation', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setPlaying('the-lounge');

    expect(lastState(setActivity)).toBe('🎶 Jamming out in #the-lounge');

    const calls = setActivity.mock.calls.length;
    vi.advanceTimersByTime(5000);

    expect(setActivity).toHaveBeenCalledTimes(calls);
    manager.stop();
  });

  it('a new creep target shows immediately', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setCreeping(CREEP);

    expect(lastState(setActivity)).toBe(CREEP);
    manager.stop();
  });

  it('alternates between creeping and hints while a gamer is around', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setCreeping(CREEP);

    expect(lastState(setActivity)).toBe(CREEP);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[1]);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(CREEP);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[2]);
    manager.stop();
  });

  it('music outranks the rotation and resumes it when cleared', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setCreeping(CREEP);
    manager.setPlaying('the-lounge');

    expect(lastState(setActivity)).toBe('🎶 Jamming out in #the-lounge');

    manager.clearPlaying();
    vi.advanceTimersByTime(1000);

    expect([CREEP, ...HINTS]).toContain(lastState(setActivity));
    manager.stop();
  });

  it('clearing the creep while it is shown moves to a hint immediately', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setCreeping(CREEP);

    expect(lastState(setActivity)).toBe(CREEP);

    manager.clearCreeping();

    expect(HINTS).toContain(lastState(setActivity));
    manager.stop();
  });

  it('re-setting the same creep text does not reset the rotation', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setCreeping(CREEP);

    const calls = setActivity.mock.calls.length;

    manager.setCreeping(CREEP);
    manager.setCreeping(CREEP);

    expect(setActivity).toHaveBeenCalledTimes(calls);
    manager.stop();
  });
});
