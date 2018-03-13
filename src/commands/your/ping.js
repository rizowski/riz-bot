
module.exports = async (client, message) => {
  const cleanPing = `${client.ping}`.split('.')[0];

  await message.channel.send(`My ping to this server is ${ cleanPing }`);
};
