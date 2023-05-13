# @pigyuma/react-utils

`@pigyuma/react-utils` is a package that provides custom hooks, utility components and functions for React.

## Installation

```shell
yarn add @pigyuma/react-utils react react-dom
```

## Usage

```tsx
import { Box, useEvent } from '@pigyuma/react-utils';

const MyComponent = () => {
  const onClick = useEvent(() => {
    alert('Hello, World!');
  });

  return (
    <Box as="button" type="button" onClick={onClick}>
      Greeting
    </Box>
  );
};
```
