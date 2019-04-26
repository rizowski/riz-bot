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
      fields,
    },
  };
}

const cmd = {
  title: 'The Help Command',
  example: 'help',
  description: 'This will show this help.',
  requirements: {},
  regex: /help/i,
  trigger: (content) => {
    return cmd.regex.test(content);
  },
  conditions: [],
  action(client, message) {
    return message.channel.send(createHelp());
  },
};

module.exports = cmd;
