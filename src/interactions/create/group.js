const { channelMention, roleMention } = require('@discordjs/builders');

const cmd = {
  trigger(data) {
    return ['create', 'add'].includes(data.commandName) && data.options.getSubcommand() === 'group';
  },
  async action(interaction) {
    const { guild, member } = interaction;
    const groupName = interaction.options.getString('name');
    const name = `g:${groupName}`;

    guild.roles.create({});

    const role = await guild.roles.create({
      name,
      color: 'BLUE',
      reason: `Group created ${name} by ${member.user.tag}`,
    });

    const everyone = guild.roles.resolve('101471536719888384');

    const parent = await guild.channels.create(name, {
      type: 'GUILD_CATEGORY',
      reason: `Group created ${name} by ${member.user.tag}`,
    });

    const newChannel = await guild.channels.create(groupName, {
      type: 'GUILD_TEXT',
      parent,
      permissionOverwrites: [
        {
          id: everyone.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: role.id,
          allow: [
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'USE_EXTERNAL_EMOJIS',
          ],
        },
      ],
    });

    await guild.channels.create(groupName, {
      type: 'GUILD_VOICE',
      parent,
      bitrate: 64000,
      permissionOverwrites: [
        {
          id: everyone.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: role.id,
          allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
        },
      ],
    });

    await member.roles.add(role.id);

    await interaction.editReply({
      content: `I created this ${channelMention(newChannel.id)} and this ${roleMention(
        role.id
      )} for you. You have also already been added to it.`,
      ephemeral: true,
    });
  },
};
module.exports = cmd;
