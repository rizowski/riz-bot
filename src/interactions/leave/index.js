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
        .addStringOption((o) =>
          o.setName('role').setDescription('The group to leave').setRequired(true).setAutocomplete(true)
        )
    ),
];

export const cmds = [group];
