const { expect } = require('chai');
const command = require('../../../src/commands/your/uptime');

describe('your:uptime', () => {
  describe('trigger', () => {
    let validCommands;
    let invalidCommands;

    before(() => {
      validCommands = [
        'your uptime',
        'uptime',
        'your uptime additional params'
      ];
      invalidCommands = [
        'what is your uptime',
        'your'
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
