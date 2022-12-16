/**
 * @typedef { import("vitest/config").UserConfig } UserConfig
 */

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const rootDir = (...paths) => path.resolve(__dirname, ...paths);

const appNames = ['web'];
const packageNames = ['react-utility-types', 'react-utils', 'ui', 'utils'];

const createCustomWorkspaceResolver = (workspaceType) => {
  return (replacedPath) => {
    const moduleNames = workspaceType === 'app' ? appNames : workspaceType === 'package' ? packageNames : [];
    for (let i = 0; i < moduleNames.length; i++) {
      const moduleName = moduleNames[i];
      const globPattern = rootDir(`../../${workspaceType}s/${moduleName}`, `${replacedPath}?(.*)`);
      const filePath = glob.sync(globPattern)[0];
      if (filePath) {
        return filePath;
      }
    }
    return undefined;
  };
};

/** @type {UserConfig.test.alias} */
const workspacesAlias = [
  // Root inside app
  { find: new RegExp('^~/'), replacement: '', customResolver: createCustomWorkspaceResolver('app') },
  // Root inside package
  { find: new RegExp('^@/'), replacement: '', customResolver: createCustomWorkspaceResolver('package') },
  // Other packages
  ...packageNames.map((name) => ({ find: `^@pigyuma/${name}/(.*)$`, replacement: rootDir(`../../packages/${name}/$1`) })),
];

module.exports = {
  workspacesAlias,
};
