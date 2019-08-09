import { VoiceRegion } from 'discord.js';
import { Command } from '../command.d';
import { Embedable } from '../../../../../responses.d';

import logger from '../../../../../logger';
import emoji from '../../../../../emojis';
import { CommandError } from '../../../../../errors';

interface CreatePendingInput {
  theChosenOne: VoiceRegion;
  oldRegion: VoiceRegion;
}

interface PingInput {
  newPing: number;
  oldPing: number;
}

function calculatePing(newPing: number, oldPing: number): string {
  const mathed = oldPing - newPing;

  if (mathed === 0) {
    return emoji.meh;
  }

  if (mathed > 0) {
    return emoji.yea;
  }

  return emoji.nay;
}

function createSuccess({ newPing, oldPing }: PingInput, region: VoiceRegion): Embedable {
  const color = region.optimal ? 16312092 : 47377;
  const stars = region.optimal ? emoji.star : '';
  const improvement = calculatePing(newPing, oldPing);

  return {
    embed: {
      title: [stars, 'Change Successful', stars].join(' '),
      color,
      fields: [
        {
          name: 'Current Ping',
          value: `${newPing || 'idk'}ms`,
          inline: true,
        },
        {
          name: 'New Region:',
          value: region.name || 'Earth',
          inline: true,
        },
        {
          name: 'VIP?',
          value: region.vip ? emoji.yea : emoji.nay,
          inline: true,
        },
        {
          name: 'Strongest Potion?',
          value: region.optimal ? "You can't handle it" : emoji.nay,
          inline: true,
        },
        {
          name: 'Improved?',
          value: improvement,
          inline: true,
        },
      ],
    },
  };
}

// @ts-ignore
function createPending(ping: number, { theChosenOne, oldRegion = {} }: CreatePendingInput): Embedable {
  const defaultLocation = 'Earth';

  return {
    embed: {
      title: 'Changing Region...',
      color: 36025,
      fields: [
        {
          name: 'Current Ping',
          value: `${ping || 'idk'}ms`,
          inline: true,
        },
        {
          name: 'Moving to...',
          value: `${oldRegion.name || defaultLocation} --> ${theChosenOne.name || defaultLocation}`,
          inline: true,
        },
        {
          name: 'Leaving Optimal Server?',
          value: oldRegion.optimal ? emoji.yea : emoji.nay,
          inline: true,
        },
        {
          name: 'Going to Optimal Server?',
          value: theChosenOne.optimal ? emoji.yea : emoji.nay,
        },
      ],
    },
  };
}

const cmd: Command = {
  title: 'Change Server Region',
  help: {
    description: 'Change the region of the server',
    examples: ['change regions'],
  },
  requirements: {
    guild: true,
    mod: true,
  },
  regex: /^(change|move) region(s)?/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action({ client, message }) {
    message.channel.startTyping();
    const regions = await client.fetchVoiceRegions();
    const oldRegion = regions.get(message.guild.region) || {};
    const sorted = regions
      .filter((r) => r.name.startsWith('US') && r.id !== message.guild.region)
      // @ts-ignore
      .sort((a, b) => b.optimal);
    const [[, theChosenOne]] = sorted;
    const oldPing = Math.floor(client.ping);

    // @ts-ignore
    await message.channel.send(createPending(oldPing, { theChosenOne, oldRegion }));

    try {
      await message.guild.setRegion(theChosenOne.id);
      const newPing = Math.floor(client.ping);
      await message.channel.send(createSuccess({ newPing, oldPing }, theChosenOne));
    } catch (error) {
      logger.error(error);

      const err = new CommandError({
        title: 'Failed to change region',
        command: cmd.help.examples[0],
        reason: error.message,
      });

      await message.channel.send(err.serialize());
    } finally {
      message.channel.stopTyping();
    }
  },
};

export default cmd;
