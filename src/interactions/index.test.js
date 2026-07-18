import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MessageFlags } from 'discord.js';

const { ephemeralAction, publicAction } = vi.hoisted(() => ({
  ephemeralAction: vi.fn(),
  publicAction: vi.fn(),
}));

vi.mock('@local/logger', () => ({
  default: { info: vi.fn(), error: vi.fn() },
}));

vi.mock('./all.js', () => ({
  definitions: [],
  cmds: [
    {
      trigger: (interaction) => interaction.commandName === 'secret',
      ephemeral: true,
      action: ephemeralAction,
    },
    {
      trigger: (interaction) => interaction.commandName === 'public',
      ephemeral: false,
      action: publicAction,
    },
  ],
}));

const { run } = await import('./index.js');

function fakeInteraction(overrides = {}) {
  return {
    commandId: '123',
    commandName: 'secret',
    options: { getSubcommand: vi.fn(() => null) },
    reply: vi.fn(),
    deferReply: vi.fn(),
    editReply: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('interactions.run', () => {
  it('replies exactly once for unknown commands and never defers', async () => {
    const interaction = fakeInteraction({ commandName: 'nope' });

    await run(interaction, {});

    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Command `/nope` has not been implemented yet.',
      flags: MessageFlags.Ephemeral,
    });
    expect(interaction.deferReply).not.toHaveBeenCalled();
    expect(ephemeralAction).not.toHaveBeenCalled();
    expect(publicAction).not.toHaveBeenCalled();
  });

  it('defers with the ephemeral flag for ephemeral commands', async () => {
    const interaction = fakeInteraction({ commandName: 'secret' });

    await run(interaction, {});

    expect(interaction.deferReply).toHaveBeenCalledWith({ flags: MessageFlags.Ephemeral });
    expect(ephemeralAction).toHaveBeenCalledTimes(1);
  });

  it('defers publicly for non-ephemeral commands', async () => {
    const interaction = fakeInteraction({ commandName: 'public' });

    await run(interaction, {});

    expect(interaction.deferReply).toHaveBeenCalledWith({});
    expect(publicAction).toHaveBeenCalledTimes(1);
  });

  it('reports action failures through editReply instead of throwing', async () => {
    ephemeralAction.mockRejectedValueOnce(new Error('boom'));
    const interaction = fakeInteraction({ commandName: 'secret' });

    await expect(run(interaction, {})).resolves.toBeUndefined();

    expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Something failed. ||boom||' });
  });
});
