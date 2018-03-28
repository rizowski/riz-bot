const uptime = require('../../utils/uptime');

module.exports = {
  title: 'Get My Uptime',
  example: 'your uptime',
  description: 'Responds with the admin\'s uptime',
  requirements: {},
  trigger(cmd) {
    return /(your )?uptime/i.test(cmd);
  },
  conditions: [],
  action(client, message) {
    return message.channel.send(uptime(client.uptime));
  }
};
