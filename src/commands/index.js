
module.exports = {
  do(cmd, subCmd, client, message) {
    try {
      const extension = subCmd ? `/${subCmd}` : '';

      const doAction = require(`./${cmd}${extension}`);
      doAction(client, message);
    } catch(e) {
      if (e.message.includes('Cannot find module')) {
        console.warn(e.message);
        return;
      }

      throw e;
    }
  }
};
