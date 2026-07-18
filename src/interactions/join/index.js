import { SlashCommandBuilder } from 'discord.js';
import group from './group.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join something')
    .addSubcommand((sc) =>
      sc
        .setName('group')
        .setDescription('Join a group')
        .addStringOption((o) =>
          o.setName('role').setDescription('The group to join').setRequired(true).setAutocomplete(true)
        )
    ),
];

export const cmds = [group];
