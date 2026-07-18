import { ChannelType, Collection } from 'discord.js';
import { describe, expect, it, vi } from 'vitest';
import invite from './invite.js';

function fakeMember({ id, bot = false, roleIds = [] }) {
  return {
    id,
    user: { bot },
    roles: {
      cache: new Collection(roleIds.map((r) => [r, { id: r }])),
      add: vi.fn(),
    },
  };
}

function setup({ inviterRoles = ['10'], target = fakeMember({ id: '2' }) } = {}) {
  const role = { id: '10', name: 'g:gamers' };
  const text = { id: '77', name: 'gamers', type: ChannelType.GuildText, send: vi.fn() };
  const guild = {
    roles: { cache: new Collection([[role.id, role]]) },
    channels: { cache: new Collection([['77', text]]) },
  };

  const interaction = {
    commandName: 'group',
    guild,
    user: { id: '1', username: 'inviter' },
    member: fakeMember({ id: '1', roleIds: inviterRoles }),
    options: { getSubcommand: () => 'invite', getString: () => '10', getMember: () => target },
    editReply: vi.fn(),
  };

  return { interaction, target, text };
}

describe('/group invite', () => {
  it('requires the inviter to be in the group', async () => {
    const { interaction, target } = setup({ inviterRoles: [] });

    await invite.action(interaction);

    expect(target.roles.add).not.toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Members only' })] })
    );
  });

  it('adds the role and welcomes the invitee in the group channel', async () => {
    const { interaction, target, text } = setup();

    await invite.action(interaction);

    expect(target.roles.add).toHaveBeenCalledWith('10', 'Invited by inviter');
    expect(text.send).toHaveBeenCalledWith(expect.stringContaining('<@2>'));
    expect(text.send).toHaveBeenCalledWith(expect.stringContaining('<@1>'));
  });

  it('refuses to invite bots', async () => {
    const { interaction, target } = setup({ target: fakeMember({ id: '2', bot: true }) });

    await invite.action(interaction);

    expect(target.roles.add).not.toHaveBeenCalled();
  });

  it('does not re-add someone already in the group', async () => {
    const { interaction, target } = setup({ target: fakeMember({ id: '2', roleIds: ['10'] }) });

    await invite.action(interaction);

    expect(target.roles.add).not.toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: [expect.objectContaining({ title: 'Already in' })] })
    );
  });
});
