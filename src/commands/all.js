const flatten = require('lodash.flatten');

const commands = flatten([
  require('./add'),
  require('./change'),
  require('./your'),
  require('./stats'),
  require('./set'),
  require('./join'),
  require('./get'),
]);

function verifyContract(cmds) {
  const requiredKeys = ['title', 'description', 'example', 'requirements', 'trigger', 'conditions'];

  return cmds.map((cmd) => {
    const cmdKeys = Object.keys(cmd);
    requiredKeys.forEach((rKey) => {
      if (!cmdKeys.includes(rKey)) {
        throw new Error(`${rKey} is missing from ${cmd.title || cmd.description}`);
      }
    });

    if (!cmdKeys.includes('action') && !cmdKeys.includes('actions')) {
      throw new Error(`action(s) is missing from ${cmd.title || cmd.description}`);
    }

    return cmd;
  });
}

module.exports = verifyContract(commands);
