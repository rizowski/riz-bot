import { SlashCommandBuilder } from 'discord.js';
import version from './version.js';

export const definitions = [
  new SlashCommandBuilder().setName('version').setDescription('Returns the version of the bot'),
];

export const cmds = [version];
