const { cleanDecimals } = require('../utils/string');

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

module.exports = ({ data, username, mode, matchType, region, season }) => {
  return {
    // content: '',
    embed: {
      title: `Get Ranked ${ username }!`,
      // color: '',
      description: `Current stats for ${mode} ${matchType} in ${region} for the season ${ season }`,
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
          value: cleanDecimals(`${ data.stats.longest_kill_max }`),
          inline: true
        },
        {
          name: 'Highest Rank',
          value: data.max_ranks.rating,
          inline: true,
        },
        {
          name: 'Average Rank',
          value: cleanDecimals(`${ data.stats.rank_avg }`),
          inline: true
        },
        {
          name: 'Average Damage Dealt',
          value: cleanDecimals(`${data.stats.damage_dealt_avg}`),
          inline: true
        },
        // {
        //   name: 'Average Time Survived',
        //   value: clean(`${data.stats.time_survived_avg}`),
        //   inline: true
        // }
      ]
    }
  };
};
