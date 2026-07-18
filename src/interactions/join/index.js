import { SlashCommandBuilder } from 'discord.js';
import group from './group.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join something')
    .addSubcommand((sc) =>
      sc
        .setName('group')
        .setDescription('The role to join, usually prefixed with g:')
        .addRoleOption((o) => o.setName('role').setDescription('The role to add').setRequired(true))
    ),
];

export const cmds = [group];
