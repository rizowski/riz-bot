const moment = require('moment');
const axios = require('axios');
const logger = require('./logger');
const users = require('./users');
const { InputError } = require('./errors');

process.on('unhandledrejection', console.log);

const squadMap = {
  squad: 4,
  duo: 2,
  solo: 1
};

function getSquadSize(size) {
  return squadMap[size];
}

module.exports = {
  async getStats({ username, season = moment().format('YYYY-MM'), region = 'na', matchType = 'squad', mode = 'tpp' }) {
    const squadSize = getSquadSize(matchType);
    const user = users.getUser(username);
    const url = `https://pubg.op.gg/api/users/${user.pubgId}/ranked-stats?season=${season}&server=${region}&queue_size=${squadSize}&mode=${mode}`;

    try {
      const { data } = await axios(url);

      return { data /* url */};
    } catch (e) {
      logger.error(e.response.status, e.response.statusText, username, e.request.path);

      if (e.response.status === 404) {
        throw new InputError({ reason: `${username} doesn't seem to have played this season.` });
      }

      throw e;
    }
  }
};
