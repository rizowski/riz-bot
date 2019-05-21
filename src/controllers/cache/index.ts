import config from 'config';
import { createClient } from './redis';

const client = createClient(config.redis);

process.on('exit', client.disconnect);
process.on('SIGINT', client.disconnect);
process.on('SIGTERM', client.disconnect);

export async function cache(lookup: string, func: (...stuff: any) => any): Promise<any> {
  const result = await client.get(lookup);

  if (result) {
    return result;
  }

  const funcResult = await func();

  await client.set(lookup, funcResult);

  return funcResult;
}

export default { ...client };
