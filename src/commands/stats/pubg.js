const moment = require('moment');
const pubg = require('../../pubg');
const users = require('../../users');
const logger = require('../../logger');

const usernames = /^(rizowski|rokwar|bacon|zack|namelessginger)$/i;
const regions = /^(na|eu)$/i;
const seasons = /^(current|last)$/i;
const matchType = /^(squad|duo|solo)$/i;
const modes = /^(tpp|fpp)$/i;

function getArgs(args, message) {
  const obj = args.reduce((acc, thing) => {
    if (usernames.test(thing)) {
      acc.username = thing;
    }
    if (regions.test(thing)) {
      acc.region = thing;
    }
    if (seasons.test(thing)) {
      acc.season = thing;
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

  if(!obj.season){
    obj.season = moment().format('YYYY-MM');
  }

  if(!obj.matchType){
    obj.matchType = 'squad';
  }

  if(!obj.mode){
    obj.mode = 'tpp';
  }

  return obj;
}

function clean(str = '') {
  return str.split('.')[0];
}

const rankImages = {
  F: 'https://imgur.com/o8jUS2C.png',
  'D-': 'https://imgur.com/01VBDNn.png',
  D: 'https://imgur.com/bLC9N2c.png',
  'D+': 'https://imgur.com/xxYHw5d.png',
  'C-': 'https://imgur.com/Z9Ne54Z.png',
  C: 'https://imgur.com/Huk0bRp.png',
  'C+': 'https://imgur.com/xR3xW2H.png',
  'B-': 'https://imgur.com/mdyIMD4.png',
  B: 'https://imgur.com/RN8uqG2.png',
  'B+': 'https://imgur.com/8wvhgS7.png',
  'A-': 'https://imgur.com/Zcp9zGe.png',
  A: 'https://imgur.com/H3g3qXy.png',
  'A+': 'https://imgur.com/f4UyWJl.png',
  S: 'https://imgur.com/AzxM5sN.png',
  SS: 'https://imgur.com/MvJDS3G.png'
};

function getRankImage(rank) {
  return rankImages[rank] || rankImages.F;
}

module.exports = {
  title: 'Look up pubg stats',
  example: 'pubg stats [username] [tpp|fpp] [solo|duo|squad]',
  description: 'Check your stats for pubg. Arguments can come in any order.',
  requirements: { },
  trigger(cmd) {
    return /(pubg stats|((rank|stats) pubg))/i.test(cmd);
  },
  conditions: [],
  async action(client, message, args = []) {
    const parsedArgs = getArgs(args, message);
    const user = users.getUser(parsedArgs.username);
    try {
      const { data } = await pubg.getStats(parsedArgs);

      await message.channel.send({
        // content: '',
        embed: {
          title: `Get Ranked ${ user.pubgUsername || parsedArgs.username }!`,
          // color: '',
          description: `Current Stats for ${parsedArgs.mode} ${parsedArgs.matchType} in ${parsedArgs.region}`,
          // url: '',
          thumbnail: {
            url: getRankImage(data.grade)
          },
          fields: [
            {
              name: 'Rating',
              value: data.stats.rating,
              inline: true
            },
            {
              name: 'Total Wins',
              value: data.stats.win_matches_cnt,
              inline: true
            },
            {
              name: 'Current Rank',
              value: data.ranks.rating,
              inline: true
            },
            {
              name: 'Total Matches',
              value: data.stats.matches_cnt,
              inline: true
            },
            {
              name: 'Total Kills',
              value: data.stats.kills_sum,
              inline: true
            },
            {
              name: 'Max Kills',
              value: data.stats.kills_max,
              inline: true
            },
            {
              name: 'Longest Kill',
              value: clean(`${ data.stats.longest_kill_max }`),
              inline: true
            },
            {
              name: 'Highest Rank',
              value: data.max_ranks.rating,
              inline: true,
            },
            {
              name: 'Average Rank',
              value: clean(`${ data.stats.rank_avg }`),
              inline: true
            },
            {
              name: 'Average Damage Dealt',
              value: clean(`${data.stats.damage_dealt_avg}`),
              inline: true
            },
            // {
            //   name: 'Average Time Survived',
            //   value: clean(`${data.stats.time_survived_avg}`),
            //   inline: true
            // }
          ]
        }
      });
    } catch(e) {
      logger.error(e);

      if(e.createEmbed){
        const embed = e.createEmbed();
        return message.channel.send(embed);
      }
    }
  }
};
