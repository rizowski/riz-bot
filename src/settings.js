const fs = require('fs');
const path = require('path');

const logger = require('./logger');

const local = path.resolve(__dirname, '../config/local.json');

module.exports = {
  createConfig() {
    try {
      fs.statSync(local);
    } catch(e) {
      if (e.code === 'ENOENT') {
        logger.log({ message: 'Writing the config file', path: local });
        fs.writeFileSync(local, JSON.stringify({ discord: { token: '' } }, null, 2));
      }
    }
  }
};
