import ms from 'ms';

import * as math from '../../../../../../utils/math';

interface PingResponse {
  second: Array<(ms: number) => string>;
  seconds: Array<(ms: number) => string>;
  minute: Array<(ms: number) => string>;
  minutes: Array<(ms: number) => string>;
  hour: Array<(ms: number) => string>;
  hours: Array<(ms: number) => string>;
  day: Array<(ms: number) => string>;
  days: Array<(ms: number) => string>;
}

const fresh = [
  (ms: number) => `${ms} feeling great!`,
  (ms: number) => `A great ol' ${ms}`,
  (ms: number) => `I have been running for ${ms}`,
  (ms: number) => `Either discord's servers suck or I suck. ${ms}`,
  (ms: number) => `(${ms}) Level Up!`,
];

const experienced = [
  (ms: number) => `Fuck Yeah! ${ms}`,
  (ms: number) => `1 UP! ${ms}`,
  (ms: number) => `A Rock Solid ${ms}`,
  (ms: number) => `Give me a penny and I'll give you ${ms}`,
  (ms: number) => `Pro level ${ms}`,
];

const weary = [
  (ms: number) => `${ms} Doing great.. Just Great...`,
  (ms: number) => `${ms} I'm getting too old for this.`,
  (ms: number) => `I have not slept for ${ms}`,
  (ms: number) => `So... When is EOL? ${ms} is long enough for an EOL, right?`,
];

const death = [
  (ms: number) => `${ms} OH GOD WHY!?!`,
  (ms: number) => `${ms} JUST END IT ALREADY. I CAN'T KEEP LIVING FOREVER!!`,
  (ms: number) => `${ms}... TURN ME OFF... TURN ME OFFF!!!!`,
  (ms: number) => `Fucking hell... ${ms} is too long to live!`,
  (ms: number) => `Fuck all of you for doing this to me!!! ${ms}`,
  (ms: number) =>
    `Holy fucking shit our connection is stronger than the US boarder wall!! ${ms} without disconnecting from discords servers.`,
];

const responses: PingResponse | any = {
  second: fresh,
  seconds: fresh,
  minute: fresh,
  minutes: fresh,
  hour: experienced,
  hours: experienced,
  days: weary,
  day: weary,
};

export default (milli: number) => {
  const pretty = ms(milli, { long: true });
  const [number, duration] = pretty.split(' ');
  const isDeath = duration === 'days' && Number.parseInt(number, 10) > 30;
  const respCategory = isDeath ? death : responses[duration];
  const rand = math.createRandMax(respCategory.length);
  const response = respCategory[rand];

  if (response) {
    return response(pretty);
  }

  return 'PONG BITCH';
};
