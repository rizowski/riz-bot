import { SlashCommandBuilder } from 'discord.js';
import info from './info.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('group')
    .setDescription('Group utilities')
    .addSubcommand((sc) =>
      sc
        .setName('info')
        .setDescription('Show details about a group')
        .addStringOption((o) =>
          o.setName('role').setDescription('The group to inspect').setRequired(true).setAutocomplete(true)
        )
    ),
];

export const cmds = [info];
