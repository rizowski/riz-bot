export const GROUP_PREFIX = 'g:';

export function groupRoles(guild) {
  return guild.roles.cache.filter((role) => role.name.startsWith(GROUP_PREFIX));
}

// Resolves an autocomplete value (role id) or free-typed text (with or
// without the g: prefix) to a group role. Returns null for non-group roles.
export function resolveGroupRole(guild, input) {
  const byId = guild.roles.cache.get(input);

  if (byId) {
    return byId.name.startsWith(GROUP_PREFIX) ? byId : null;
  }

  const query = input.trim().toLowerCase();
  const name = query.startsWith(GROUP_PREFIX) ? query : `${GROUP_PREFIX}${query}`;

  return groupRoles(guild).find((role) => role.name.toLowerCase() === name) ?? null;
}

export async function respondWithGroups(interaction) {
  const focused = interaction.options.getFocused().toLowerCase();

  const choices = groupRoles(interaction.guild)
    .filter((role) => role.name.toLowerCase().includes(focused))
    .map((role) => ({ name: role.name, value: role.id }))
    .slice(0, 25);

  await interaction.respond(choices);
}
