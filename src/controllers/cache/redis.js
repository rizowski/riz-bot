const redis = require('redis');
const logger = require('../../logger');

module.exports = {
  createClient(options = {}) {
    const { host = 'localhost', port = 6379 } = options;
    const client = redis.createClient({
      host,
      port,
    });
    let noop = false;

    client.on('error', async (err) => {
      logger.error('Redis Error', err);
      await client.quit();
      logger.error('Redis disconnected');
      noop = true;
    });

    return {
      disconnect() {
        return new Promise((resolve) => {
          if (noop) {
            resolve();
          }
          client.quit(() => {
            resolve();
          });
        });
      },
      get(what) {
        return new Promise((resolve, reject) => {
          if (noop) {
            resolve();
          }
          client.get(`${what}`, (err, result) => {
            if (err) return reject(err);

            try {
              const obj = JSON.parse(result);
              return resolve(obj);
            } catch (error) {
              reject(error);
            }
          });
        });
      },
      set(what, thing) {
        const value = typeof thing === 'string' ? thing : JSON.stringify(thing);
        return new Promise((resolve, reject) => {
          if (noop) {
            resolve();
          }
          client.set(what, value, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      },
      delete(what) {
        return new Promise((resolve, reject) => {
          if (noop) {
            resolve();
          }
          client.del(what, (err, val) => {
            if (err) return reject(err);
            resolve(val);
          });
        });
      },
    };
  },
};
