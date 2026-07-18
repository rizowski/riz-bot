import { describe, expect, it } from 'vitest';
import { embeds } from './index.js';

describe('embeds', () => {
  it('returns the plural embeds array shape Discord expects', () => {
    const payload = embeds.error({ title: 'Nope', description: 'It broke' });

    expect(payload).toEqual({
      embeds: [
        {
          title: 'Nope',
          description: 'It broke',
          color: 12124160,
          fields: undefined,
        },
      ],
    });
  });

  it('uses the success color and passes fields through', () => {
    const fields = [{ name: 'a', value: 'b' }];
    const payload = embeds.success({ title: 'Yay', description: 'It worked' }, fields);

    expect(payload.embeds[0].color).toBe(47377);
    expect(payload.embeds[0].fields).toBe(fields);
  });
});
