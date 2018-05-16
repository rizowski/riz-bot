const { expect } = require('chai');
const command = require('../../../src/commands/stats/pubg');

describe('stats:pubg', () => {
  describe('trigger', () => {
    let validCommands;
    let invalidCommands;

    before(() => {
      validCommands = [
        'pubg stats',
        'rank pubg',
        'stats pubg',
        'pubg stats additional params'
      ];
      invalidCommands = [
        'wonder what my pubg stats are'
      ];
    });

    it('does not trigger on invalid commands', () => {
      invalidCommands.forEach((cmd) => {
        const result = command.trigger(cmd);

        expect(result).to.equal(false, cmd);
      });
    });

    it('triggers on valid commands', () => {
      validCommands.forEach((cmd) => {
        const result = command.trigger(cmd);

        expect(result).to.equal(true, cmd);
      });
    });
  });
});
