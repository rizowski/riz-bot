const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { discord } = require('config');

const join = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Join something')
  .addSubcommand((sc) =>
    sc
      .setName('group')
      .addMentionableOption((m) => m.setName('role').setDescription('The role to add').setRequired(true))
      .setDescription('The Role to join usually prefixed with g:')
  )
  .toJSON();

const version = new SlashCommandBuilder().setName('version').setDescription('Returns the version of the bot').toJSON();
const change = new SlashCommandBuilder()
  .setName('change')
  .setDescription('Change settings for the server or bot')
  .addSubcommand((sc) => sc.setName('region').setDescription('Change the server region'))
  .toJSON();
const list = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List something')
  .addSubcommand((sc) => sc.setName('groups').setDescription('List joinable groups'))
  .toJSON();

const leave = new SlashCommandBuilder()
  .setName('leave')
  .setDescription('Leave something')
  .addSubcommand((sc) =>
    sc
      .setName('group')
      .setDescription('Leave a group')
      .addMentionableOption((m) => m.setName('role').setDescription('The role to leave').setRequired(true))
  )
  .toJSON();

const create = new SlashCommandBuilder()
  .setName('create')
  .setDescription('Create something')
  .addSubcommand((sc) =>
    sc
      .setName('group')
      .setDescription('Create a group')
      .addStringOption((o) => o.setName('name').setDescription('Name of the group').setRequired(true))
  )
  .toJSON();

const commands = [create, join, version, change, list, leave];

const rest = new REST({ version: '9' }).setToken(discord.token);

const update = () => {
  return rest
    .put(Routes.applicationGuildCommands(discord.clientId, discord.guildId), { body: commands })
    .then(() => {
      console.log('Successfully registered application commands.');
    })
    .catch(console.error);
};

const del = () => {
  return rest
    .put(Routes.applicationGuildCommands(discord.clientId, discord.guildId), { body: [] })
    .then(() => {
      console.log('Successfully registered application commands.');
    })
    .catch(console.error);
};

update();
