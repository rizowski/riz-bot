import { describe, expect, it } from 'vitest';
import { formatTime, progressBar } from './format.js';

describe('formatTime', () => {
  it('formats minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(599)).toBe('9:59');
  });

  it('includes hours for long tracks', () => {
    expect(formatTime(3671)).toBe('1:01:11');
  });

  it('clamps negatives to zero', () => {
    expect(formatTime(-5)).toBe('0:00');
  });
});

describe('progressBar', () => {
  it('puts the knob at the start when nothing has played', () => {
    expect(progressBar(0, 100, 10)).toBe(`🔘${'▬'.repeat(9)}`);
  });

  it('puts the knob at the end when finished', () => {
    expect(progressBar(100, 100, 10)).toBe(`${'▬'.repeat(9)}🔘`);
  });

  it('never overflows past the end', () => {
    expect(progressBar(500, 100, 10)).toBe(`${'▬'.repeat(9)}🔘`);
    expect(progressBar(500, 100, 10)).toHaveLength(11);
  });

  it('renders a plain bar when duration is unknown', () => {
    expect(progressBar(42, 0, 10)).toBe('▬'.repeat(10));
  });
});
