/* eslint-disable complexity */
const camelcase = require('lodash.camelcase');
const pubg = require('../../pubg');
const users = require('../../users');
const logger = require('../../logger');
const pubgStats = require('../../transformers/pubg-stats');

const regions = /^(na|eu)$/i;
const seasonsReg = /^(current)|(season\s[0-1][0-9])$/i;
const dateSeason = /^(2017-pre[5-6])|(2018-[0-1][0-9])$/i;
const matchType = /^(squad|duo|solo)$/i;
const modes = /^(tpp|fpp)$/i;
const seasons = {
  season5: '2018-05',
  season4: '2018-04',
  season3: '2018-03',
  season2: '2018-02',
  season1: '2018-01',
  preSeason6: '2017-pre6',
  preSeason5: '2017-pre5',
  current: '2018-05',
};

function getArgs(args, message) {
  const obj = args.reduce((acc, thing) => {
    if (!acc.username) {
      const user = users.getUser(thing);

      acc.username = user && user.pubgUsername;
    }

    if (regions.test(thing)) {
      acc.region = thing;
    }

    if (seasonsReg.test(thing)) {
      acc.season = seasons[camelcase(thing)] || thing;
    }

    if (!acc.season && dateSeason.test(thing)) {
      acc.season = seasons.current;
    }

    if (matchType.test(thing)) {
      acc.matchType = thing;
    }

    if (modes.test(thing)) {
      acc.mode = thing;
    }

    return acc;
  }, {});

  if (!obj.username) {
    obj.username = message.author.id;
  }

  if (!obj.region){
    obj.region = 'na';
  }

  if (!obj.season) {
    obj.season = seasons.current;
  }

  if(!obj.matchType){
    obj.matchType = 'squad';
  }

  if(!obj.mode){
    obj.mode = 'tpp';
  }

  return obj;
}

module.exports = {
  title: 'Look up pubg stats',
  example: 'pubg stats [username] [tpp|fpp] [solo|duo|squad] [season 1..4|2018-03]',
  description: 'Check your stats for pubg. Arguments can come in any order.',
  requirements: { },
  trigger(cmd) {
    return /^((pubg stats)|((rank|stats) pubg))/i.test(cmd);
  },
  conditions: [],
  async action(client, message, args = []) {
    const parsedArgs = getArgs(args, message);
    const { mode, matchType, region, season } = parsedArgs;
    const user = users.getUser(parsedArgs.username);
    const username = user.pubgUsername || parsedArgs.username;

    logger.log(parsedArgs);

    try {
      const { data } = await pubg.getStats(parsedArgs);

      await message.channel.send(pubgStats({ data, username, mode, matchType, region, season }));
    } catch(e) {
      logger.error({ message: e.message });

      if (e.createEmbed) {
        const embed = e.createEmbed();
        return await message.channel.send(embed);
      }

      if (e.response.status === 422 && Object.keys(e.response.data.errors).includes('season')) {
        return await message.channel.send(`God damn it <@${users.rizowski.discordId}>... The season ${parsedArgs.season} doesn't exist.`);
      }
    }
  }
};
