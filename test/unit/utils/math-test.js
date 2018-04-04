const { expect } = require('chai');
const math = require('../../../src/utils/math');

describe('unit: math', () => {
  describe('createRandRange', () => {
    it('generates numbers between a range inclusively', () => {
      for (let i = 0; i < 1000; i++) {
        const result = math.createRandRange(1, 10);

        expect(result).to.be.below(11).and.above(0);
      }
    });
  });

  describe('createRandMax', () => {
    it('generates numbers below the max exclusively', () => {
      for(let i = 0; i < 1000; i++){
        const result = math.createRandMax(10);

        expect(result).to.be.below(10).and.above(-1);
      }
    });
  });
});
