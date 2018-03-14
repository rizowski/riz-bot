const ms = require('ms');

const fresh = [
  (ms) => (`${ms} Feeling great!`),
  (ms) => (`A great ${ms}`),
  (ms) => (`I have been running for ${ ms }`),
];

const experienced = [
  (ms) => (`Fuck Yeah! ${ms}`),
  (ms) => (`1 UP! ${ms}`),
  (ms) => (`A Rock Solid ${ms}`),
];

const weary = [
  (ms) => (`${ms} Doing great.. Just Great...`),
  (ms) => (`${ms} I'm getting too old for this.`),
  (ms) => (`I have not slept for ${ms}`),
];

const death = [
  (ms) => (`${ms} OH GOD WHY!?!`),
  (ms) => (`${ms} JUST END IT ALREADY. I CAN'T KEEP LIVING FOREVER!!`),
  (ms) => (`${ ms }... TURN ME OFF... TURN ME OFFF!!!!`),
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

function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = (milli) => {
  const pretty = ms(milli, { long: true });
  const [ number, duration] = pretty.split(' ');
  let respCategory;
  if (duration === 'days' && parseInt(number, 10) > 30) {
    respCategory = death;
  } else {
    respCategory = responses[duration];
  }
  const rand = getRandom(respCategory.length);
  const response = respCategory[rand];

  return response(pretty);
};
