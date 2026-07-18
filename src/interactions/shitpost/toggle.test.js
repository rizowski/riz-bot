import { beforeEach, describe, expect, it, vi } from 'vitest';
import { on, off } from './toggle.js';
import { isEnabled, setEnabled } from '../../shitpost/state.js';
import { users } from '../../shitpost/users.js';

function fakeInteraction(userId) {
  return {
    commandName: 'shitpost',
    user: { id: userId },
    options: { getSubcommand: () => 'on' },
    editReply: vi.fn(),
  };
}

beforeEach(() => {
  setEnabled(true);
});

describe('/shitpost toggle permissions', () => {
  it('lets listed users toggle', async () => {
    await off.action(fakeInteraction(users.rizo));

    expect(isEnabled()).toBe(false);

    await on.action(fakeInteraction(users.zack));

    expect(isEnabled()).toBe(true);
  });

  it('refuses everyone else', async () => {
    const interaction = fakeInteraction('999999999999999999');

    await off.action(interaction);

    expect(isEnabled()).toBe(true);
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: [expect.objectContaining({ title: 'Nice try' })],
      })
    );
  });

  it('refuses mee6 even though it is in the user map', async () => {
    await off.action(fakeInteraction(users.mee6));

    expect(isEnabled()).toBe(true);
  });
});
