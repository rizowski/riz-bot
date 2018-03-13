
function createHelp() {
  return {
    embed: {
      title: 'Help',
      description: 'Any command needs to be prefixed with !',
      fields: [
        {
          name: '!add emoji [emojiName]',
          value: 'Add an emoji to the server. defaults to filename if emojiName is not provided',
        },
        {
          name: '!change region',
          value: 'Change the region of the server.'
        },
        {
          name: '!your ping',
          value: 'Responds with the admin\'s ping to discord',
          inline: true
        },
        {
          name: '!your uptime',
          value: 'Responds with the admin\'s uptime',
          inline: true
        },
        {
          name: '!help',
          value: 'This will show this help.'
        },
      ]
    }
  };
}

module.exports = async (client, message) => {
  await message.channel.send(createHelp());
};
