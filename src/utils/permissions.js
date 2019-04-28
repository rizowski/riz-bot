const { rizowski } = require('../users');

function isInGuild(message) {
  return message.guild && message.guild.available;
}

function hasModPermissions(message) {
  return message.author.lastMessage.member.roles.has('572127185784012820');
}

function hasBasicPermissions(message) {
  return (
    message.author.lastMessage.member.roles.has('572120296052752394') || hasModPermissions(message)
  );
}

function isOwner(message) {
  return message.author.id === rizowski.discordId;
}

function isTester(message) {
  return message.author.lastMessage.member.roles.has('572134709472133131');
}

function getPermissions(message) {
  const owner = isOwner(message);
  const tester = isTester(message);

  const result = {
    owner,
    basic: hasBasicPermissions(message) || owner || tester,
    mod: hasModPermissions(message) || owner || tester,
    inGuild: isInGuild(message),
  };

  return result;
}

module.exports = {
  getPermissions,
  isOwner,
  isTester,
  hasModPermissions,
  hasBasicPermissions,
  isInGuild,
};
