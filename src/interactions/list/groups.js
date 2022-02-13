const prefix = 'g:';

module.exports = {
  trigger(interaction) {
    return interaction.commandName === 'list' && interaction.options.getSubcommand() === 'groups';
  },
  async action(interaction) {
    const { guild } = interaction;
    const groups = guild.roles.cache.filter((r) => r.name.startsWith(prefix));

    await interaction.editReply({
      embeds: [
        {
          title: 'Available Groups:',
          description: `Join a group by executing \`/join group @${prefix}role-name\``,
          fields: groups.map((g) => {
            const name = g.name.replace(`${prefix}`, '');

            return {
              name,
              value: `\`@${g.name}\``,
              inline: true,
            };
          }),
        },
      ],
    });
  },
};
