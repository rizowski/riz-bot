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

describe('status manager', () => {
  it('shows a hint immediately and rotates on the interval', () => {
    const setActivity = vi.fn();
    const manager = createStatusManager({ setActivity, intervalMs: 1000 });

    manager.setIdle();

    expect(lastState(setActivity)).toBe(HINTS[0]);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[1]);
    manager.stop();
  });

  it('wraps around the hint list', () => {
    const setActivity = vi.fn();
    const manager = createStatusManager({ setActivity, intervalMs: 1000 });

    manager.setIdle();
    vi.advanceTimersByTime(1000 * HINTS.length);

    expect(lastState(setActivity)).toBe(HINTS[0]);
    manager.stop();
  });

  it('setIdle is idempotent while already rotating', () => {
    const setActivity = vi.fn();
    const manager = createStatusManager({ setActivity, intervalMs: 1000 });

    manager.setIdle();
    manager.setIdle();

    expect(setActivity).toHaveBeenCalledTimes(1);
    manager.stop();
  });

  it('setPlaying shows the jam status and pauses the rotation', () => {
    const setActivity = vi.fn();
    const manager = createStatusManager({ setActivity, intervalMs: 1000 });

    manager.setIdle();
    manager.setPlaying('the-lounge');

    expect(lastState(setActivity)).toBe('🎶 Jamming out in #the-lounge');

    const calls = setActivity.mock.calls.length;
    vi.advanceTimersByTime(5000);

    expect(setActivity).toHaveBeenCalledTimes(calls);
    manager.stop();
  });

  it('returning to idle resumes rotation with the next hint', () => {
    const setActivity = vi.fn();
    const manager = createStatusManager({ setActivity, intervalMs: 1000 });

    manager.setIdle();
    manager.setPlaying('the-lounge');
    manager.setIdle();

    expect(lastState(setActivity)).toBe(HINTS[1]);

    vi.advanceTimersByTime(1000);

    expect(lastState(setActivity)).toBe(HINTS[2]);
    manager.stop();
  });
});
