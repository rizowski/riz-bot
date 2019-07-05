const { expect } = require('chai');
const { default: command } = require('../../../../src/commands/actions/change-region');

describe('change:region', () => {
  describe('trigger', () => {
    let validCommands;
    let invalidCommands;

    before(() => {
      validCommands = ['change region', 'change regions', 'move regions', 'move region', 'change region something'];
      invalidCommands = ['i want to change region', 'change my region', 'change server region', ' change region'];
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
