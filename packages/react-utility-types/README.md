# @pigyuma/react-utility-types

`@pigyuma/react-utility-types` is a package that provides utility functions for CSS. This package requires `@vanilla-extract/css`.

## Installation

```shell
yarn add @pigyuma/react-utility-types
```

## Usage

```ts
import { createVar, createGlobalVar } from '@pigyuma/react-utility-types';

const localVar = createVar();
const globalVar = createGlobalVar(':root', 'accent-color', 'blue');
```
