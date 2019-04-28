const cmd = {
  title: 'Add a level',
  description: 'Creates a level that mee6 can assign',
  requirements: {
    guild: true,
    mod: true,
  },
  regex: /^(add|create) level/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  action() {},
};

module.exports = cmd;
