import { SlashCommandBuilder } from 'discord.js';
import info from './info.js';
import invite from './invite.js';
import remove from './remove.js';

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
    )
    .addSubcommand((sc) =>
      sc
        .setName('invite')
        .setDescription('Invite someone to a group')
        .addStringOption((o) =>
          o.setName('role').setDescription('The group to invite them to').setRequired(true).setAutocomplete(true)
        )
        .addUserOption((o) => o.setName('user').setDescription('Who to invite').setRequired(true))
    )
    .addSubcommand((sc) =>
      sc
        .setName('remove')
        .setDescription('Remove a group and its channels (restricted)')
        .addStringOption((o) =>
          o.setName('role').setDescription('The group to remove').setRequired(true).setAutocomplete(true)
        )
    ),
];

export const cmds = [info, invite, remove];
