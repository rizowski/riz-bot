import { describe, expect, it } from 'vitest';
import { createConfig } from './index.js';

describe('createConfig', () => {
  it('uses a pino-pretty transport at trace level for local', () => {
    const config = createConfig('local');

    expect(config.level).toBe('trace');
    expect(config.transport.target).toBe('pino-pretty');
  });

  it('is silent for test', () => {
    const config = createConfig('test');

    expect(config.level).toBe('silent');
    expect(config.transport).toBeUndefined();
  });

  it('defaults to info with no transport', () => {
    const config = createConfig('prod');

    expect(config.level).toBe('info');
    expect(config.transport).toBeUndefined();
  });
});
