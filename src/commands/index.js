const logger = require('../logger');

module.exports = {
  do(cmd, subCmd, client, message, args) {
    try {
      const extension = subCmd ? `/${subCmd}` : '';

      const doAction = require(`./${cmd}${extension}`);
      doAction(client, message, args);
    } catch(e) {
      if (e.message.includes('Cannot find module')) {
        logger.warn({ message: 'Cannot find module', error: e.message });
        return;
      }

      throw e;
    }
  }
};
