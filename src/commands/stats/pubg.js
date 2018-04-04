const moment = require('moment');
const pubg = require('../../pubg');
const users = require('../../users');
const logger = require('../../logger');
const pubgStats = require('../../transformers/pubg-stats');

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
    const { mode, matchType, region } = parsedArgs;
    const user = users.getUser(parsedArgs.username);
    const username = user.pubgUsername || parsedArgs.username;

    try {
      const { data } = await pubg.getStats(parsedArgs);

      await message.channel.send(pubgStats({ data, username, mode, matchType, region }));
    } catch(e) {
      logger.error({ message: e.message });

      if(e.createEmbed){
        const embed = e.createEmbed();
        return message.channel.send(embed);
      }
    }
  }
};
