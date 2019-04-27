const ms = require('ms');
const math = require('../../../utils/math');

const fresh = [
  (ms) => `${ms} feeling great!`,
  (ms) => `A great ol' ${ms}`,
  (ms) => `I have been running for ${ms}`,
  (ms) => `Either discord's servers suck or I suck. ${ms}`,
  (ms) => `(${ms}) Level Up!`,
];

const experienced = [
  (ms) => `Fuck Yeah! ${ms}`,
  (ms) => `1 UP! ${ms}`,
  (ms) => `A Rock Solid ${ms}`,
  (ms) => `Give me a penny and I'll give you ${ms}`,
  (ms) => `Pro level ${ms}`,
];

const weary = [
  (ms) => `${ms} Doing great.. Just Great...`,
  (ms) => `${ms} I'm getting too old for this.`,
  (ms) => `I have not slept for ${ms}`,
  (ms) => `So... When is EOL? ${ms} is long enough for an EOL, right?`,
];

const death = [
  (ms) => `${ms} OH GOD WHY!?!`,
  (ms) => `${ms} JUST END IT ALREADY. I CAN'T KEEP LIVING FOREVER!!`,
  (ms) => `${ms}... TURN ME OFF... TURN ME OFFF!!!!`,
  (ms) => `Fucking hell... ${ms} is too long to live!`,
  (ms) => `Fuck all of you for doing this to me!!! ${ms}`,
  (ms) =>
    `Holy fucking shit our connection is stronger than the US boarder wall!! ${ms} without disconnecting from discords servers.`,
];

const responses = {
  second: fresh,
  seconds: fresh,
  minute: fresh,
  minutes: fresh,
  hour: experienced,
  hours: experienced,
  days: weary,
  day: weary,
};

module.exports = (milli) => {
  const pretty = ms(milli, { long: true });
  const [number, duration] = pretty.split(' ');
  const isDeath = duration === 'days' && parseInt(number, 10) > 30;
  const respCategory = isDeath ? death : responses[duration];
  const rand = math.createRandMax(respCategory.length);
  const response = respCategory[rand];

  return response(pretty);
};
