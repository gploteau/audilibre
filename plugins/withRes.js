const { withDangerousMod } = require('@expo/config-plugins');
const { Paths } = require('@expo/config-plugins/build/android');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

function withRes(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const resDirDest = await Paths.getResourceFolderAsync(config.modRequest.projectRoot);
      const resDirSource = path.join(__dirname, 'res');

      fs.cpSync(resDirSource, resDirDest, { recursive: true });

      return config;
    },
  ]);
}

module.exports = withRes;
