import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HINTS, createStatusManager } from './manager.js';

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

  it('clearPlaying resumes rotation with the next hint', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setPlaying('the-lounge');
    manager.clearPlaying();

    expect(lastState(setActivity)).toBe(HINTS[1]);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[2]);
    manager.stop();
  });

  it('creeping replaces idle hints and stops the rotation', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setCreeping('👀 Creeping on rizo playing DOOM');

    expect(lastState(setActivity)).toBe('👀 Creeping on rizo playing DOOM');

    const calls = setActivity.mock.calls.length;
    vi.advanceTimersByTime(5000);

    expect(setActivity).toHaveBeenCalledTimes(calls);
    manager.stop();
  });

  it('music outranks creeping, which outranks hints', () => {
    const { setActivity, manager } = makeManager();

    manager.start();
    manager.setPlaying('the-lounge');
    manager.setCreeping('👀 Creeping on rizo playing DOOM');

    expect(lastState(setActivity)).toBe('🎶 Jamming out in #the-lounge');

    manager.clearPlaying();

    expect(lastState(setActivity)).toBe('👀 Creeping on rizo playing DOOM');

    manager.clearCreeping();

    expect(lastState(setActivity)).toBe(HINTS[1]);
    manager.stop();
  });

  it('deduplicates identical consecutive statuses', () => {
    const { setActivity, manager } = makeManager();

    manager.setCreeping('👀 Creeping on rizo playing DOOM');
    manager.setCreeping('👀 Creeping on rizo playing DOOM');

    expect(setActivity).toHaveBeenCalledTimes(1);
    manager.stop();
  });
});
