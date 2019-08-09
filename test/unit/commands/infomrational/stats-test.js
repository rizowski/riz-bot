const { expect } = require('chai');
const { default: command } = require('../../../../src/events/on-message/on-command/commands/informational/stats');

describe('get:stats', () => {
  describe('trigger', () => {
    let validCommands;
    let invalidCommands;

    before(() => {
      validCommands = ['get stats', 'fetch stats', 'fetch stats something', 'get stats something'];
      invalidCommands = ['i want to get stats', 'fetch my stats', 'fetch server stats', ' get stats'];
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
