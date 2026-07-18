import { describe, expect, it } from 'vitest';
import { ApplicationCommandOptionType } from 'discord.js';
import { cmds, definitions } from './all.js';

// Every registered (command, subcommand) pair must match exactly one handler —
// a mismatch is how the old /change region command silently died.
const cases = definitions.flatMap((definition) => {
  const subcommands = (definition.options ?? []).filter((o) => o.type === ApplicationCommandOptionType.Subcommand);

  if (subcommands.length === 0) {
    return [{ commandName: definition.name, subcommand: null }];
  }

  return subcommands.map((sub) => ({ commandName: definition.name, subcommand: sub.name }));
});

describe('command registration', () => {
  it.each(cases)('/$commandName $subcommand matches exactly one handler', ({ commandName, subcommand }) => {
    const interaction = {
      commandName,
      options: { getSubcommand: () => subcommand },
    };

    const matches = cmds.filter((cmd) => cmd.trigger(interaction));

    expect(matches).toHaveLength(1);
  });

  it('every handler is reachable from a registered definition', () => {
    const matched = new Set();

    for (const { commandName, subcommand } of cases) {
      const interaction = { commandName, options: { getSubcommand: () => subcommand } };
      const cmd = cmds.find((c) => c.trigger(interaction));

      if (cmd) {
        matched.add(cmd);
      }
    }

    expect(matched.size).toBe(cmds.length);
  });
});
