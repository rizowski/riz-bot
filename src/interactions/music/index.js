import { SlashCommandBuilder } from 'discord.js';
import play from './play.js';
import nowplaying from './nowplaying.js';
import skip from './skip.js';
import stop from './stop.js';
import queue from './queue.js';
import shuffle from './shuffle.js';
import pause from './pause.js';
import resume from './resume.js';
import volume from './volume.js';

export const definitions = [
  new SlashCommandBuilder()
    .setName('music')
    .setDescription('Play music in your voice channel')
    .addSubcommand((sc) =>
      sc
        .setName('play')
        .setDescription('Play a song, playlist, or search result')
        .addStringOption((o) =>
          o.setName('query').setDescription('YouTube URL, playlist URL, or search terms').setRequired(true)
        )
    )
    .addSubcommand((sc) => sc.setName('nowplaying').setDescription('Show the current track and progress'))
    .addSubcommand((sc) => sc.setName('skip').setDescription('Skip the current track'))
    .addSubcommand((sc) => sc.setName('stop').setDescription('Stop playback, clear the queue, and leave'))
    .addSubcommand((sc) => sc.setName('queue').setDescription('Show the current queue'))
    .addSubcommand((sc) => sc.setName('shuffle').setDescription('Shuffle the queue'))
    .addSubcommand((sc) => sc.setName('pause').setDescription('Pause playback'))
    .addSubcommand((sc) => sc.setName('resume').setDescription('Resume playback'))
    .addSubcommand((sc) =>
      sc
        .setName('volume')
        .setDescription('Set the playback volume')
        .addIntegerOption((o) =>
          o
            .setName('percent')
            .setDescription('Volume percent (0-150)')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(150)
        )
    ),
];

export const cmds = [play, nowplaying, skip, stop, queue, shuffle, pause, resume, volume];
