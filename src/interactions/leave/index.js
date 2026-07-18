import { SlashCommandBuilder } from 'discord.js';
import group from './group.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave something')
    .addSubcommand((sc) =>
      sc
        .setName('group')
        .setDescription('Leave a group')
        .addRoleOption((o) => o.setName('role').setDescription('The role to leave').setRequired(true))
    ),
];

export const cmds = [group];
