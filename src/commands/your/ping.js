
module.exports = async (client, message) => {
  await message.channel.send(`My ping to this server is ${ client.ping }`);
};
