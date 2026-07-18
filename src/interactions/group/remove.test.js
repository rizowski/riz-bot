import { ChannelType, Collection } from 'discord.js';
import { describe, expect, it, vi } from 'vitest';
import remove from './remove.js';
import { users } from '../../shitpost/users.js';

function fakeGuild() {
  const role = { id: '10', name: 'g:gamers', delete: vi.fn() };
  const text = { name: 'gamers', type: ChannelType.GuildText, delete: vi.fn() };
  const voice = { name: 'gamers', type: ChannelType.GuildVoice, delete: vi.fn() };
  const category = { name: 'g:gamers', type: ChannelType.GuildCategory, delete: vi.fn() };

  const roles = new Collection([[role.id, role]]);
  const channels = new Collection([
    ['1', text],
    ['2', voice],
    ['3', category],
  ]);

  return { guild: { roles: { cache: roles }, channels: { cache: channels } }, role, text, voice, category };
}

// `confirm` simulates what awaitMessageComponent resolves to:
// an object for a click, or a rejection for a timeout.
function fakeInteraction(guild, userId, { roleInput = '10', confirm } = {}) {
  const message = {
    awaitMessageComponent: confirm ? vi.fn().mockResolvedValue(confirm) : vi.fn().mockRejectedValue(new Error('time')),
  };

  return {
    commandName: 'group',
    guild,
    user: { id: userId, username: 'tester' },
    options: { getSubcommand: () => 'remove', getString: () => roleInput },
    editReply: vi.fn().mockResolvedValue(message),
  };
}

describe('/group remove', () => {
  it('refuses users not on the shitpost list', async () => {
    const { guild, role } = fakeGuild();
    const interaction = fakeInteraction(guild, '999999999999999999');

    await remove.action(interaction);

    expect(role.delete).not.toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Nice try' })] })
    );
  });

  it('rejects non-group roles', async () => {
    const { guild, role } = fakeGuild();
    const interaction = fakeInteraction(guild, users.rizo, { roleInput: 'not-a-group' });

    await remove.action(interaction);

    expect(role.delete).not.toHaveBeenCalled();
  });

  it('deletes everything after the confirm button', async () => {
    const { guild, role, text, voice, category } = fakeGuild();
    const confirm = { customId: 'group-remove-confirm', deferUpdate: vi.fn(), update: vi.fn() };
    const interaction = fakeInteraction(guild, users.rizo, { confirm });

    await remove.action(interaction);

    expect(text.delete).toHaveBeenCalled();
    expect(voice.delete).toHaveBeenCalled();
    expect(category.delete).toHaveBeenCalled();
    expect(role.delete).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenLastCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Group removed' })], components: [] })
    );
  });

  it('deletes nothing on cancel', async () => {
    const { guild, role, text } = fakeGuild();
    const confirm = { customId: 'group-remove-cancel', deferUpdate: vi.fn(), update: vi.fn() };
    const interaction = fakeInteraction(guild, users.rizo, { confirm });

    await remove.action(interaction);

    expect(role.delete).not.toHaveBeenCalled();
    expect(text.delete).not.toHaveBeenCalled();
    expect(confirm.update).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Cancelled' })], components: [] })
    );
  });

  it('deletes nothing on timeout', async () => {
    const { guild, role, text } = fakeGuild();
    const interaction = fakeInteraction(guild, users.rizo);

    await remove.action(interaction);

    expect(role.delete).not.toHaveBeenCalled();
    expect(text.delete).not.toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenLastCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Timed out' })], components: [] })
    );
  });
});
