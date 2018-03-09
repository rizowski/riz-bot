const fs = require('fs');
const path = require('path');

const local = path.resolve(__dirname, '../config/local.json');

module.exports = {
  createConfig() {
    try {
      fs.statSync(local);
    } catch(e) {
      if (e.code === 'ENOENT') {
        console.log('Writing the config file');
        fs.writeFileSync(local, JSON.stringify({ discord: { token: '' } }, null, 2));
      }
    }
  }
};
