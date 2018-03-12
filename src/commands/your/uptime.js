const uptime = require('../../utils/uptime');

module.exports = async (client, message) => {
  await message.channel.send(uptime(client.uptime));
};
