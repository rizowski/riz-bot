const { expect } = require('chai');
const command = require('../../../src/commands/add/emoji');

describe('add:emoji', () => {
  describe('trigger', () => {
    let validCommands;
    let invalidCommands;

    before(() => {
      validCommands = [
        'add emoji',
        'create emoji',
        'create emoji something',
      ];
      invalidCommands = [
        'emoji',
        ' emoji',
        'i want to add emoji',
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
