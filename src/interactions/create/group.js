import { ChannelType, Colors, PermissionFlagsBits, channelMention, roleMention } from 'discord.js';

export default {
  trigger(interaction) {
    return interaction.commandName === 'create' && interaction.options.getSubcommand() === 'group';
  },
  ephemeral: true,
  async action(interaction) {
    const { guild, member } = interaction;
    const groupName = interaction.options.getString('name');
    const name = `g:${groupName}`;
    const reason = `Group created ${name} by ${member.user.username}`;

    const role = await guild.roles.create({
      name,
      color: Colors.Blue,
      reason,
    });

    const everyone = guild.roles.everyone;

    const parent = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      reason,
    });

    // The bot must include itself: minimal guild permissions don't bypass
    // the @everyone deny below, and an invisible channel breaks welcomes,
    // /group info, and /music in this group.
    const bot = interaction.client.user;

    const newChannel = await guild.channels.create({
      name: groupName,
      type: ChannelType.GuildText,
      parent: parent.id,
      reason,
      permissionOverwrites: [
        {
          id: everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: bot.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: role.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.UseExternalEmojis,
          ],
        },
      ],
    });

    await guild.channels.create({
      name: groupName,
      type: ChannelType.GuildVoice,
      parent: parent.id,
      bitrate: 64000,
      reason,
      permissionOverwrites: [
        {
          id: everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: bot.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
        },
        {
          id: role.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
        },
      ],
    });

    await member.roles.add(role.id);

    await interaction.editReply({
      content: `I created this ${channelMention(newChannel.id)} and this ${roleMention(
        role.id
      )} for you. You have also already been added to it.`,
    });
  },
};
