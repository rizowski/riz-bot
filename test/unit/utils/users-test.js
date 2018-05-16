const { expect } = require('chai');
const users = require('../../../src/users');

describe('users', () => {
  Object.entries(users)
    .forEach(([user, obj]) => {
      if (typeof obj !== 'function') {
        describe(`given ${user}`, () => {
          Object.entries(obj)
            .forEach(([key]) => {
              it(`can find by ${key}`, () => {
                const result = users.getUser(obj[key]);

                expect(result).to.eql(obj);
              });
            });

          it('can find by @userTag', () => {
            const result = users.getUser(`<@${obj.discordId}>`);

            expect(result).to.eql(obj);
          });
        });
      }
    });
});
