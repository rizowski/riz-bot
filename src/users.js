const find = require('lodash.find');

const bacon = {
  discordId: '108352053692125184',
  pubgId: '59fe353748cc140001cac1fb',
  pubgUsername: 'rurururururururu',
  user: 'bacon',
};

const zack = {
  discordId: '108568431053246464',
  pubgId: '59fe3738ae385e00013f4ffc',
  pubgUsername: 'kozaku',
  user: 'zack'
};

const jerran = {
  discordId: '189006310501646336',
  pubgId: '59fe352ffd5b360001cb6bc7',
  pubgUsername: 'namelessginger',
  user: 'jerran',
};

const rizowski = {
  discordId: '100758264047747072',
  pubgId: '59fe35486a259d0001640eac',
  pubgUsername: 'rizowski',
  user: 'rizo',
};

const aaron = {
  discordId: '65055432095301632',
  pubgId: '59fe352ffd5b360001cb6bbd',
  pubgUsername: 'rokwar',
  user: 'aaron'
};

const users = [
  bacon, zack, jerran, rizowski, aaron,
];


module.exports = {
  getUser(thing = '') {
    const searchTerm = thing.toLowerCase();

    return find(users, (u) => {
      return `<@${u.discordId}>` === searchTerm
          || u.discordId === searchTerm
          || u.pubgId === searchTerm
          || u.pubgUsername === searchTerm
          || u.user === searchTerm;
    });
  },
  bacon,
  zack,
  jerran,
  rizowski,
  aaron
};
