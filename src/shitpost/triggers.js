import { formatEmoji, userMention } from 'discord.js';
import logger from '@local/logger';
import { emojis, letter, parrotWaves } from './emojis.js';
import { users } from './users.js';
import { BLAZE_IT_RE, DOG_TRIGGERS, MUFASA_URL, hesNotYour, spongebobCase } from './lib.js';

const chance = (p) => Math.random() < p;
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const sentBy = (message, userId) => message.author.id === userId;
const mentions = (message, userId) => message.mentions.users.has(userId);

// Constant markup, built once instead of per message.
const FRIDAY_TAG = formatEmoji(emojis.friday);
const WOWEE_TAG = formatEmoji(emojis.wowee);
const FEELSBADMAN_TAG = formatEmoji(emojis.feelsbadman);
const ZACK_MENTION_TRIGGER = `@${formatEmoji(emojis.zack)}`;
const PARROT_WAVE_LINE = parrotWaves.map((wave) => formatEmoji(wave)).join(' ');

const middleFingers = {
  aaron: `${formatEmoji(emojis.bepsi)} ${userMention(users.aaron)} 🖕`,
  bacon: `🥓 ${userMention(users.bacon)} 🖕`,
  jerran: `${formatEmoji(emojis.wendyparrot)} ${userMention(users.jerran)} 🖕`,
  rizo: `${userMention(users.rizo)} 🖕`,
  zack: `${formatEmoji(emojis.zack)} ${userMention(users.zack)} 🖕`,
};

async function reactWord(message, word) {
  for (const char of word) {
    const emoji = letter(char);

    if (emoji) {
      await message.react(emoji);
    }
  }
}

// Every trigger receives (message, lower) where lower is the message content
// lowercased exactly once per message.
export const triggers = [
  // reaction replies
  async function wendyParrot(message) {
    if (sentBy(message, users.jerran) && chance(0.2)) {
      await message.react(emojis.wendyparrot.id);
    }
  },
  async function bepsi(message) {
    if (sentBy(message, users.aaron) && chance(0.15)) {
      await message.react(emojis.bepsi.id);
    }
  },
  async function gkappa(message) {
    if (chance(0.0005)) {
      await message.react(emojis.gkappa.id);
    }
  },
  async function gzack(message) {
    if (sentBy(message, users.zack) && chance(0.01)) {
      await message.react(emojis.gzack.id);
    }
  },
  async function zack(message) {
    if (sentBy(message, users.zack) && chance(0.2)) {
      await message.react(emojis.zack.id);
    }
  },
  async function rizoPls(message) {
    if (mentions(message, users.rizo)) {
      await reactWord(message, 'rizopls');
    }
  },
  async function sick(message) {
    if (message.content === '🤢') {
      await reactWord(message, 'sick');
    }
  },
  async function friday(message) {
    if (message.content.includes(FRIDAY_TAG)) {
      await message.channel.send(pick(['https://giphy.com/gifs/black-LqzgIzNWDiyFG', MUFASA_URL]));
    }
  },
  async function dog(message, lower) {
    const isWowee = message.content === WOWEE_TAG;
    const isDogTrigger = DOG_TRIGGERS.some((t) => lower.includes(t));

    if (isWowee || isDogTrigger) {
      const response = await fetch('https://api.thedogapi.com/v1/images/search?mime_types=gif');
      const [result] = await response.json();

      if (result?.url) {
        await message.channel.send(result.url);
      }
    }
  },
  async function theArchitect(message, lower) {
    if (lower.includes('the architect')) {
      await message.channel.send('_**T H E   A R C H I T E C T**_');
    }
  },
  async function blazeIt(message, lower) {
    if (lower.includes('blaze it') || BLAZE_IT_RE.test(message.content)) {
      await message.react(emojis.snoop.id);
    }
  },
  async function hesNotYourTrigger(message, lower) {
    const retort = hesNotYour(lower);

    if (retort) {
      await message.channel.send(retort);
    }
  },
  async function feelsBadMan(message) {
    if (message.content.includes(FEELSBADMAN_TAG)) {
      await message.react(emojis.feelsbadman.id);
    }
  },
  async function malthor(message, lower) {
    if (lower.includes('malthor')) {
      await message.channel.send('You mean Malthor? The Destroyer?');
    }
  },
  // simple replies
  async function fuckYou(message, lower) {
    if (message.content === 'fuck you all') {
      await Promise.all(Object.values(middleFingers).map((line) => message.channel.send(line)));

      return;
    }

    if (!lower.includes('fuck you')) {
      return;
    }

    for (const [name, line] of Object.entries(middleFingers)) {
      if (lower.includes(name) || mentions(message, users[name])) {
        await message.channel.send(line);
      }
    }
  },
  async function steam(message) {
    if (sentBy(message, users.aaron) && message.content.includes('store.steampowered.com')) {
      await message.channel.send('No Aaron, no one wants to buy your steam game');
    }
  },
  async function mentionBacon(message) {
    if (message.content.includes('@🥓')) {
      await message.channel.send(userMention(users.bacon));
    }
  },
  async function mentionZack(message) {
    if (message.content.includes(ZACK_MENTION_TRIGGER)) {
      await message.channel.send(userMention(users.zack));
    }
  },
  async function nsa(message, lower) {
    if (sentBy(message, users.rizo) && lower.includes('alder')) {
      await message.channel.send('👁👄👁 but the NSA');
    }
  },
  // unique replies
  async function randomRizoReaction(message) {
    if (sentBy(message, users.rizo) && chance(0.2)) {
      await pick([
        async () => {
          for (const wave of parrotWaves) {
            await message.react(wave.id);
          }
        },
        () => message.react(emojis.ultrafastparrot.id),
        () => message.react(emojis.party_parrot.id),
      ])();
    }
  },
  async function ketsgi(message, lower) {
    if (lower.includes('letsgo') || lower.includes('ketsgi')) {
      await pick([
        () => reactWord(message, 'letsgo'),
        () => reactWord(message, 'ketsgi'),
        () => message.react(emojis.letsgo.id),
      ])();
    }
  },
  async function henlo(message, lower) {
    if (lower.includes('henlo')) {
      const mention = userMention(message.author.id);
      await message.channel.send(`henlo ${mention}\nhelllo you STINKY ${mention}\ngo shitpost ugly`);
    }
  },
  async function spongebob(message) {
    if (message.content.length >= 10 && chance(0.01)) {
      await message.channel.send(spongebobCase(message.content));
    }
  },
  async function koolAid(message) {
    if (message.content === 'oh no') {
      // The original gfycat link died with gfycat; same energy, new host.
      await Promise.all([
        message.channel.send('https://media.giphy.com/media/lgcUUCXgC8mEo/giphy.gif'),
        reactWord(message, 'ohyea'),
      ]);
    }
  },
  async function parrotWave(message) {
    if (message.content === '🦜') {
      await message.channel.send(PARROT_WAVE_LINE);
    }
  },
  async function badBot(message) {
    if (message.content === 'bad bot') {
      await message.channel.send(`fuck you ${userMention(message.author.id)}`);
    }
  },
  async function goodBot(message) {
    if (message.content === 'good bot') {
      await message.channel.send(`😊 aww thanks ${userMention(message.author.id)}`);
    }
  },
];

export async function runTriggers(message) {
  const lower = message.content.toLowerCase();
  const results = await Promise.allSettled(triggers.map((trigger) => trigger(message, lower)));

  for (const [index, result] of results.entries()) {
    if (result.status === 'rejected') {
      logger.error({ message: 'Shitpost trigger failed', trigger: triggers[index].name, err: result.reason });
    }
  }
}
