import { SlashCommandBuilder } from 'discord.js';
import group from './group.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create something')
    .addSubcommand((sc) =>
      sc
        .setName('group')
        .setDescription('Create a group')
        .addStringOption((o) => o.setName('name').setDescription('Name of the group').setRequired(true))
    ),
];

export const cmds = [group];
