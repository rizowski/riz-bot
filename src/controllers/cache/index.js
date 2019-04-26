const config = require('config');
const { createClient } = require('./redis');

const client = createClient(config.redis);

process.on('exit', client.disconnect);
process.on('SIGINT', client.disconnect);
process.on('SIGTERM', client.disconnect);

module.exports = {
  async cache(lookup, func) {
    const result = await client.get(lookup);

    if (result) {
      return result;
    }

    const funcResult = await func();

    await client.set(lookup, funcResult);

    return funcResult;
  },
  ...client,
};
