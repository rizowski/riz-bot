// const { expect } = require('chai');
const uptime = require('../../../src/commands/your/uptime/uptime');

describe('unit: uptime responses', () => {
  const times = {
    twoMins: 100000,
    oneHour: 10000000,
    oneDay: 100000000,
    plusThrity: 10000000000,
  };

  before(() => {});

  it('death', () => {
    console.log(uptime(times.plusThrity));
  });

  it('does weary', () => {
    console.log(uptime(times.oneDay));
  });

  it('does experienced', () => {
    console.log(uptime(times.oneHour));
  });

  it('does fresh', () => {
    console.log(uptime(times.twoMins));
  });
});
