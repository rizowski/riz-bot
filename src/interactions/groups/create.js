const cmd = {
  // conditions: [
  //   {
  //     name: 'specified arguments',
  //     condition(message, client, args) {
  //       if (args.length === 0) {
  //         return new PreconditionError({ reason: 'Must specify group name' });
  //       }
  //     },
  //   },
  //   {
  //     name: 'group exists',
  //     condition(message, client, args) {
  //       const groupName = args[0].toLowerCase();
  //       const result = message.guild.channels
  //         .reduce((acc, thing) => {
  //           if (thing.type === 'category' && thing.name.startsWith(prefix)) {
  //             acc.push(thing.name.replace(`${prefix} `, '').toLowerCase());
  //           }

  //           return acc;
  //         }, [])
  //         .map((name) => {
  //           const result = wuzzy.jaccard(groupName, name);

  //           return { name, groupName, prob: result };
  //         })
  //         .find((result) => {
  //           return result.prob > 0.9;
  //         });

  //       if (result) {
  //         throw new PreconditionError({
  //           reason: `There is a ${result.prob * 100}% chance there is a group with the name of ${result.groupName}.`,
  //           details: [
  //             { title: 'suggestion', description: `${config.token}list groups`, inline: true },
  //             { title: 'suggestion 2', description: `${config.token}join group ${groupName}`, inline: true },
  //           ],
  //         });
  //       }
  //     },
  //   },
  // ],
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
