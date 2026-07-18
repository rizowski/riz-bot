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

function fakeInteraction(guild, userId, roleInput = '10') {
  return {
    commandName: 'group',
    guild,
    user: { id: userId, username: 'tester' },
    options: { getSubcommand: () => 'remove', getString: () => roleInput },
    editReply: vi.fn(),
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

  it('deletes the channels, category, and role for listed users', async () => {
    const { guild, role, text, voice, category } = fakeGuild();
    const interaction = fakeInteraction(guild, users.rizo);

    await remove.action(interaction);

    expect(text.delete).toHaveBeenCalled();
    expect(voice.delete).toHaveBeenCalled();
    expect(category.delete).toHaveBeenCalled();
    expect(role.delete).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Group removed' })] })
    );
  });

  it('rejects non-group roles', async () => {
    const { guild, role } = fakeGuild();
    const interaction = fakeInteraction(guild, users.rizo, 'not-a-group');

    await remove.action(interaction);

    expect(role.delete).not.toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Invalid Role' })] })
    );
  });
});
