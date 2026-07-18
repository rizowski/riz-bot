import logger from '@local/logger';
import { emojis, formatEmoji, letter, parrotWaves } from './emojis.js';
import { users } from './users.js';
import { BLAZE_IT_RE, DOG_TRIGGERS, hesNotYour, spongebobCase } from './lib.js';

const chance = (p) => Math.random() < p;
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const contains = (message, text) => message.content.toLowerCase().includes(text);
const containsEmoji = (message, emoji) => message.content.includes(formatEmoji(emoji));
const sentBy = (message, userId) => message.author.id === userId;
const mentions = (message, userId) => message.mentions.users.has(userId);

async function reactWord(message, word) {
  for (const char of word) {
    const emoji = letter(char);

    if (emoji) {
      await message.react(emoji);
    }
  }
}

const middleFingers = {
  aaron: (message) => message.channel.send(`${formatEmoji(emojis.bepsi)} <@${users.aaron}> 🖕`),
  bacon: (message) => message.channel.send(`🥓 <@${users.bacon}> 🖕`),
  jerran: (message) => message.channel.send(`${formatEmoji(emojis.wendyparrot)} <@${users.jerran}> 🖕`),
  rizo: (message) => message.channel.send(`<@${users.rizo}> 🖕`),
  zack: (message) => message.channel.send(`${formatEmoji(emojis.zack)} <@${users.zack}> 🖕`),
};

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
    if (containsEmoji(message, emojis.friday)) {
      await message.channel.send(
        pick(['https://giphy.com/gifs/black-LqzgIzNWDiyFG', 'https://www.youtube.com/watch?v=1AnG04qnLqI'])
      );
    }
  },
  async function dog(message) {
    const isWowee = message.content === formatEmoji(emojis.wowee);
    const isDogTrigger = DOG_TRIGGERS.some((t) => contains(message, t));

    if (isWowee || isDogTrigger) {
      const response = await fetch('https://api.thedogapi.com/v1/images/search?mime_types=gif');
      const [result] = await response.json();

      if (result?.url) {
        await message.channel.send(result.url);
      }
    }
  },
  async function theArchitect(message) {
    if (contains(message, 'the architect')) {
      await message.channel.send('_**T H E   A R C H I T E C T**_');
    }
  },
  async function blazeIt(message) {
    if (contains(message, 'blaze it') || BLAZE_IT_RE.test(message.content)) {
      await message.react(emojis.snoop.id);
    }
  },
  async function hesNotYourTrigger(message) {
    const retort = hesNotYour(message.content);

    if (retort) {
      await message.channel.send(retort);
    }
  },
  async function feelsBadMan(message) {
    if (containsEmoji(message, emojis.feelsbadman)) {
      await message.react(emojis.feelsbadman.id);
    }
  },
  async function malthor(message) {
    if (contains(message, 'malthor')) {
      await message.channel.send('You mean Malthor? The Destroyer?');
    }
  },
  // simple replies
  async function fuckYou(message) {
    if (message.content === 'fuck you all') {
      await Promise.all(Object.values(middleFingers).map((send) => send(message)));

      return;
    }

    if (!contains(message, 'fuck you')) {
      return;
    }

    for (const [name, send] of Object.entries(middleFingers)) {
      if (contains(message, name) || mentions(message, users[name])) {
        await send(message);
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
      await message.channel.send(`<@${users.bacon}>`);
    }
  },
  async function mentionZack(message) {
    if (message.content.includes(`@${formatEmoji(emojis.zack)}`)) {
      await message.channel.send(`<@${users.zack}>`);
    }
  },
  async function nsa(message) {
    if (sentBy(message, users.rizo) && contains(message, 'alder')) {
      await message.channel.send('👁👄👁 but the NSA');
    }
  },
  // unique replies
  async function randomRizoReaction(message) {
    if (sentBy(message, users.rizo) && chance(0.2)) {
      const roll = Math.floor(Math.random() * 3) + 1;

      if (roll === 1) {
        for (const wave of parrotWaves) {
          await message.react(wave.id);
        }
      } else if (roll === 2) {
        await message.react(emojis.ultrafastparrot.id);
      } else {
        await message.react(emojis.party_parrot.id);
      }
    }
  },
  async function ketsgi(message) {
    if (contains(message, 'letsgo') || contains(message, 'ketsgi')) {
      const roll = Math.floor(Math.random() * 3);

      if (roll === 0) {
        await reactWord(message, 'letsgo');
      } else if (roll === 1) {
        await reactWord(message, 'ketsgi');
      } else {
        await message.react(emojis.letsgo.id);
      }
    }
  },
  async function henlo(message) {
    if (contains(message, 'henlo')) {
      await message.channel.send(
        `henlo <@${message.author.id}>\nhelllo you STINKY <@${message.author.id}>\ngo shitpost ugly`
      );
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
      await message.channel.send(parrotWaves.map((wave) => formatEmoji(wave)).join(' '));
    }
  },
  async function badBot(message) {
    if (message.content === 'bad bot') {
      await message.channel.send(`fuck you <@${message.author.id}>`);
    }
  },
  async function goodBot(message) {
    if (message.content === 'good bot') {
      await message.channel.send(`😊 aww thanks <@${message.author.id}>`);
    }
  },
];

export async function runTriggers(message) {
  const results = await Promise.allSettled(triggers.map((trigger) => trigger(message)));

  for (const [index, result] of results.entries()) {
    if (result.status === 'rejected') {
      logger.error({ message: 'Shitpost trigger failed', trigger: triggers[index].name, err: result.reason });
    }
  }
}
