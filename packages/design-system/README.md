# @pigyuma/design-system

A collection of design tokens, components, and guidelines that provide a consistent and intuitive user experience across all our apps.

## Installation

```shell
yarn add @pigyuma/design-system @vanilla-extract/css react react-dom
```

## Usage

```tsx
/* MyComponent.tsx */

import { Button } from '@pigyuma/design-system/components';
import * as styles from './MyComponent.css';

const MyComponent = () => {
  const onClick = () => {
    alert('Hello, World!');
  };

  return (
    <Button style={styles.myButton} onClick={onClick}>
      Gretting
    </Button>
  );
};
```

```ts
/* MyComponent.css.ts */

import foundations from '@pigyuma/design-system/foundations';
import mixins from '@pigyuma/design-system/mixins';
import { style } from '@vanilla-extract/css';

export const myButton = style([
  mixins.textBody,
  {
    margin: foundations.spacing(2),
    color: foundations.color.accent.primary,
  },
]);
```

#### Generates base styles

```ts
/* base.css.ts */

import '@pigyuma/design-system/css';
```

#### Customize theme

```ts
/* theme.css.ts */

import { customizeTheme } from '@pigyuma/design-system/config';

customizeTheme({
  color: {
    accent: {
      primary: 'blue',
    },
  },
});
```

## Modules

- `@pigyuma/design-system/components`: Contains basic UI components
- `@pigyuma/design-system/config`: Provides functions for configuration. (e.g. Theme customization)
- `@pigyuma/design-system/css`: Generates base style. (e.g. Normalize user-agent stylesheet)
- `@pigyuma/design-system/foundations`: Provides design tokens.
- `@pigyuma/design-system/mixins`: Provides mixin functions & classes.
- `@pigyuma/design-system/patterns`: Contains components for frequently used **UI design patterns**. (e.g. Grid)
