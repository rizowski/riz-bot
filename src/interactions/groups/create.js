const cmd = {
  trigger(data) {
    return data.name === 'group' && data.options?.[0].name === 'create';
  },
  async action({ data, guild, member }) {
    const groupName = data.options?.[0].options?.[0].value;
    const name = `g:${groupName}`;

    const role = await guild.roles.create({
      data: {
        name,
        color: 'BLUE',
      },
      reason: `Group created ${name}`,
    });

    const everyone = guild.roles.resolve('101471536719888384');

    const parent = await guild.channels.create(name, {
      type: 'category',
      reason: `Group created ${name}`,
    });

    const newChannel = await guild.channels.create(groupName, {
      type: 'text',
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
      type: 'voice',
      parent,
      bitrate: 128000,
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

    await newChannel.send(`Hey <@${member.id}>! I created this group for you.`);
  },
};
module.exports = cmd;
