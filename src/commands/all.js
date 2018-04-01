const flatten = require('lodash.flatten');

const commands = flatten([
  require('./add'),
  require('./change'),
  require('./your'),
  require('./stats'),
]);

function verifyContract(cmds) {
  const keys = [
    'title',
    'description',
    'example',
    'requirements',
    'trigger',
    'conditions',
    'action'
  ];

  return cmds.map((cmd) => {
    Object.keys(cmd).forEach((key) => {
      if (!keys.includes(key)) {
        throw new Error(`${key} is missing from ${cmd.title}`);
      }
    });

    return cmd;
  });
}

module.exports = verifyContract(commands);

// knutsorb express $40.68
