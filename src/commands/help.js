const commands = require('./all');

function createHelp() {
  const fields = commands.map((cmd) => {
    return {
      name: `!${cmd.example}`,
      value: cmd.description,
    };
  });

  return {
    embed: {
      title: 'Help',
      description: 'Any command needs to be prefixed with !',
      fields
    }
  };
}

module.exports = {
  title: 'The Help Command',
  example: 'help',
  description: 'This will show this help.',
  requirements: {},
  trigger: (cmd) => {
    return /help/i.test(cmd);
  },
  conditions: [],
  action(client, message) {
    return message.channel.send(createHelp());
  }
};
