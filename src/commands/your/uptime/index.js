const uptime = require('./uptime');

const cmd = {
  title: 'Get My Uptime',
  example: 'your uptime',
  description: "Responds with the admin's uptime. May or may not be depressed",
  requirements: {},
  regex: /^(your )?uptime/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  action(client, message) {
    return message.channel.send(uptime(client.uptime));
  },
};

module.exports = cmd;
