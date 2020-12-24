const globalCmds = require('./global');
const groups = require('./groups');

module.exports = [...globalCmds.cmds, ...groups.cmds];
