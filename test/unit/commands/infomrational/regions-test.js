const { expect } = require('chai');
const { default: command } = require('../../../../src/events/on-message/on-command/commands/informational/regions');

describe('get:regions', () => {
  describe('trigger', () => {
    let validCommands;
    let invalidCommands;

    before(() => {
      validCommands = ['get regions', 'fetch regions', 'fetch regions something', 'get regions something'];
      invalidCommands = ['i want to get region', 'fetch my region', 'fetch server region', ' get region'];
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
