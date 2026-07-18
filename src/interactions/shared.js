export function subcommand(command, name) {
  return (interaction) => interaction.commandName === command && interaction.options.getSubcommand() === name;
}
