import { SlashCommandBuilder } from 'discord.js';
import add from './add.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('Manage server emojis')
    .addSubcommand((sc) =>
      sc
        .setName('add')
        .setDescription('Create a server emoji from an image')
        .addAttachmentOption((o) => o.setName('image').setDescription('The image for the emoji').setRequired(true))
        .addStringOption((o) => o.setName('name').setDescription('Name for the emoji (defaults to the file name)'))
    ),
];

export const cmds = [add];
