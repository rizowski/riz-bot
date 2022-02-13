const globalCmds = require('./global');
// const regions = require('./region');
const list = require('./list');
const join = require('./join');
const leave = require('./leave');
const create = require('./create');

module.exports = [...globalCmds.cmds, /*...regions.cmds,*/ ...list.cmds, ...join.cmds, ...leave.cmds, ...create.cmds];
