const ms = require('ms');

const responses = [
  (milli) => (`I have not slept for ${milli}`),
  (milli) => (`I have been running for ${ milli }`),
  (milli) => (`${ milli }... TURN ME OFF... TURN ME OFFF!!!!`),
  (milli) => (`I have not slept for a good ol' ${ milli }`),
];

function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = (milli) => {
  const rand = getRandom(responses.length);
  const response = responses[rand];

  return response(ms(milli));
};
