const globalCmds = require('./global');
const groups = require('./groups');
const regions = require('./region');

module.exports = [...globalCmds.cmds, ...groups.cmds, ...regions.cmds];
