const { expect } = require('chai');
const { default: command } = require('../../../../src/events/on-message/on-command/commands/informational/ping');

describe('your:ping', () => {
  describe('trigger', () => {
    let validCommands;
    let invalidCommands;

    before(() => {
      validCommands = ['your ping', 'ping', 'your ping additional params'];
      invalidCommands = ['what is your ping', 'your'];
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
