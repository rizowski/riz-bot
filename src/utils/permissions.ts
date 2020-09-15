import { Message } from 'discord.js';

export interface Permissions {
  owner: boolean;
  basic: boolean;
  mod: boolean;
  inGuild: boolean;
}

const rizowskiId = '100758264047747072';

export function isInGuild(message: Message): boolean {
  return message.guild?.available;
}

export function hasModPermissions(message: Message): boolean {
  return message.author.lastMessage.member.roles.has('572127185784012820');
}

export function hasBasicPermissions(message: Message): boolean {
  return message.author.lastMessage.member.roles.has('572120296052752394') || hasModPermissions(message);
}

export function isOwner(message: Message): boolean {
  return message.author.id === rizowskiId;
}

export function isTester(message: Message): boolean {
  return message.author.lastMessage.member.roles.has('572134709472133131');
}

export function getPermissions(message: Message): Permissions {
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
