/**
 * @typedef { import("vitest/config").UserConfig } UserConfig
 */

const glob = require('glob');
const path = require('path');

const rootDir = (...paths) => path.resolve(__dirname, ...paths);

const appRootRegExp = new RegExp('^~/');
const packageRootRegExp = new RegExp('^@/');

const packageNames = ['css-utils', 'design-system', 'react-utility-types', 'react-utils', 'ui-design-tool', 'utils'];

const findResolvedFilePath = (baseDir, targetPath) => {
  // 확장자가 없거나, path 바로 뒤에 붙어 있는 경로만 추출
  // 'file' =>
  // (O) 'file'
  // (O) 'file.ts'
  // (X) 'file.test.ts'
  const anyExtensionGlobPattern = '?(.?!(*.*))';
  /** @see {@link https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows} */
  const globPattern = rootDir(baseDir, `${targetPath}${anyExtensionGlobPattern}`).replaceAll('\\', '/');
  const [found] = glob.sync(globPattern);
  return found;
};

const createSinglePathCustomResolver = (baseDir = './') => {
  return (replacedPath) => findResolvedFilePath(baseDir, replacedPath);
};

const createMultiPathsCustomResolver = (baseDirs = []) => {
  return (replacedPath) => {
    for (let i = 0; i < baseDirs.length; i++) {
      const baseDir = baseDirs[i];
      const foundPath = findResolvedFilePath(baseDir, replacedPath);
      if (foundPath) {
        return foundPath;
      }
    }
  };
};

const createNPMPackagesAlias = () => {
  return packageNames.map((name) => ({ find: `^@pigyuma/${name}/(.*)$`, replacement: rootDir(`../../packages/${name}/$1`) }));
};

const createWorkspaceAppAlias = (appName) => {
  return [
    // Root inside app
    { find: appRootRegExp, replacement: '', customResolver: createSinglePathCustomResolver(`../../apps/${appName}`) },
    // Root inside package
    {
      find: packageRootRegExp,
      replacement: '',
      customResolver: createMultiPathsCustomResolver(packageNames.map((packageName) => `../../packages/${packageName}`)),
    },
  ];
};

const createWorkspacePackageAlias = (packageName) => {
  // Root inside package
  return [
    {
      find: packageRootRegExp,
      replacement: '',
      customResolver: createSinglePathCustomResolver(path.resolve('../../packages/', packageName)),
    },
  ];
};

/** @type {UserConfig.test.alias} */
const createWorkspacesAlias = (workspace) => {
  const [workspaceType = '', workspaceName = ''] = workspace.split('/');
  const alias = createNPMPackagesAlias();
  if (workspaceType === 'apps') {
    alias.push(...createWorkspaceAppAlias(workspaceName));
  } else if (workspaceType === 'packages') {
    alias.push(...createWorkspacePackageAlias(workspaceName));
  }
  return alias;
};

module.exports = {
  createWorkspacesAlias,
};
