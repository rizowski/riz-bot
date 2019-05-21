import redis from 'redis';
import logger from '../../logger';

interface RedisOptions {
  host: string;
  port: number;
}

interface RedisClient {
  disconnect: () => Promise<undefined>;
  get: (what: string) => Promise<any>;
  set: (what: string, thing: string) => Promise<undefined>;
  delete: (what: string) => Promise<number>;
}

export function createClient(options: RedisOptions): RedisClient {
  const { host = 'localhost', port = 6379 } = options;
  const client = redis.createClient({
    host,
    port,
  });
  let noop = false;

  client.on('error', async (err) => {
    logger.error('Redis Error', err);

    await new Promise((resolve) => {
      client.quit(() => {
        resolve();
      });
    });

    logger.error('Redis disconnected');
    noop = true;
  });

  return {
    disconnect(): Promise<undefined> {
      return new Promise((resolve) => {
        if (noop) {
          resolve();
        }

        client.quit(() => {
          resolve();
        });
      });
    },
    get(what: string): Promise<object | undefined> {
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
    set(what: string, thing: string): Promise<undefined> {
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
    delete(what: string): Promise<number> {
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
}
