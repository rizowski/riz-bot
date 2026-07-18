import { SlashCommandBuilder } from 'discord.js';
import { on, off, status } from './toggle.js';
import { hype, adult, mufasa } from './fun.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('shitpost')
    .setDescription('Shitposting at its finest')
    .addSubcommand((sc) => sc.setName('on').setDescription('Unleash the chaos (restricted)'))
    .addSubcommand((sc) => sc.setName('off').setDescription('Restore order (restricted)'))
    .addSubcommand((sc) => sc.setName('status').setDescription('Is the chaos on?'))
    .addSubcommand((sc) => sc.setName('hype').setDescription('HYPE'))
    .addSubcommand((sc) => sc.setName('adult').setDescription('Summon an adult'))
    .addSubcommand((sc) => sc.setName('mufasa').setDescription('Mufasa.')),
];

export const cmds = [on, off, status, hype, adult, mufasa];
