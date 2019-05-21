import { Message, Client } from 'discord.js';
import { PreconditionError } from '../errors';

export interface Requirement {
  guild?: boolean;
  mod?: boolean;
  basic?: boolean;
}

export interface Permissions extends Requirement {}

export interface ActionInput {
  message: Message;
  client: Client;
  args: any;
  permissions: Permissions;
}

export interface Condition {
  name: string;
  condition: (message: Message, client: Client, args: string[]) => PreconditionError | void;
}

export interface Command {
  title: string;
  example: string;
  description: string;
  requirements: Requirement;
  regex: RegExp;
  trigger: (content: string) => boolean;
  conditions: Condition[];
  action: (data: ActionInput) => void;
}
