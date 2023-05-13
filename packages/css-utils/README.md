# @pigyuma/css-utils

`@pigyuma/css-utils` is a package that provides utility functions for CSS. This package requires `@vanilla-extract/css`.

## Installation

```shell
yarn add @pigyuma/css-utils @vanilla-extract/css
```

## Usage

```ts
import { createVar, createGlobalVar } from '@pigyuma/css-utils';

const localVar = createVar();
const globalVar = createGlobalVar(':root', 'accent-color', 'blue');
```
