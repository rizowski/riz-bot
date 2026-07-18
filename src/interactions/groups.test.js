import { describe, expect, it } from 'vitest';
import { Collection } from 'discord.js';
import { groupRoles, resolveGroupRole } from './groups.js';

function fakeGuild(roles) {
  const cache = new Collection();

  for (const role of roles) {
    cache.set(role.id, role);
  }

  return { roles: { cache } };
}

const guild = fakeGuild([
  { id: '1', name: 'g:gamers' },
  { id: '2', name: 'g:Movie Night' },
  { id: '3', name: 'admins' },
]);

describe('groupRoles', () => {
  it('only returns g:-prefixed roles', () => {
    expect([...groupRoles(guild).values()].map((r) => r.id)).toEqual(['1', '2']);
  });
});

describe('resolveGroupRole', () => {
  it('resolves an autocomplete role id', () => {
    expect(resolveGroupRole(guild, '1').name).toBe('g:gamers');
  });

  it('rejects role ids that are not groups', () => {
    expect(resolveGroupRole(guild, '3')).toBeNull();
  });

  it('resolves typed names with or without the prefix, case-insensitively', () => {
    expect(resolveGroupRole(guild, 'gamers').id).toBe('1');
    expect(resolveGroupRole(guild, 'g:gamers').id).toBe('1');
    expect(resolveGroupRole(guild, 'movie night').id).toBe('2');
  });

  it('returns null for unknown groups', () => {
    expect(resolveGroupRole(guild, 'does-not-exist')).toBeNull();
  });
});
