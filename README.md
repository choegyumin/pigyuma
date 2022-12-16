# Pigyuma

## What's inside?

This repository uses [Yarn 2+ (berry)](https://yarnpkg.com/) as a package manager. It includes the following packages/apps:

### Workspaces

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

#### Apps

- `web`: a [Next.js](https://nextjs.org/) app.

#### Packages

- `@pigyuma/react-utility-types`: utility types for react.
- `@pigyuma/react-utils`: shared react utilities and custom hooks.
- `@pigyuma/tsconfig`: `tsconfig.json`s used throughout the monorepo.
- `@pigyuma/ui`: CSS framework with React component library used by apps.
- `@pigyuma/utils`: utility functions like `lodash`.

#### Tools

- `eslint`: `eslint` configuration presets.
- `jest`: `jest` configuration helpers.

### Utilities

This repository has some additional tools already setup for you:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd MY-APP-OR-PACKAGE-PATH
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd MY-APP-OR-PACKAGE-PATH
yarn run dev
```

## Useful Links

- [Pipelines - Turborepo](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching - Turborepo](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching - Turborepo](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering - Turborepo](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options - Turborepo](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage - Turborepo](https://turbo.build/repo/docs/reference/command-line-reference)
