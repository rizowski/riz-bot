import { SlashCommandBuilder } from 'discord.js';
import groups from './groups.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('list')
    .setDescription('List something')
    .addSubcommand((sc) => sc.setName('groups').setDescription('List joinable groups')),
];

export const cmds = [groups];
