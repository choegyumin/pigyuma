# Pigyuma 🖌️🐷🎨

Pigyuma is a toy project that makes a UI design tool like Figma!

![Screenshot of Pigyuma Live Demo](https://github.com/choegyumin/pigyuma/raw/main/docs/screenshot.jpg)

## Live Demo

https://pigyuma.vercel.app/

## Features

- Layer Selection
- Layer Movement
- Layer Resizing
  - Precision resize: <kbd>Ctrl</kbd>
  - Resize from center: <kbd>Alt</kbd>
- Layer Rotation
- Artboard Drawing
- Shape layer Drawing
- Options control (in the panel)

### Upcoming support

Visit our [Pigyuma project plan](https://github.com/users/choegyumin/projects/4/views/1) to see the future plans for Pigyuma, including:

- Layer grouping
- Range selection
- Multi-layer Resizing and Rotation
- Zooming and Panning
- Text layer Input
- Image layer support
- SVG Support
- Code handoff
- Design tokens
- History logging

---

## Repository Structure

#### Apps

- [`web`](https://github.com/choegyumin/pigyuma/tree/dev/apps/web): Live Demo Web with Next.js.

#### Packages

- [`@pigyuma/css-utils`](https://github.com/choegyumin/pigyuma/tree/dev/packages/css-utils): Utility functions for CSS.
- [`@pigyuma/design-system`](https://github.com/choegyumin/pigyuma/tree/dev/packages/design-system): A collection of design tokens, components, and guidelines with React.
- [`@pigyuma/react-utility-types`](https://github.com/choegyumin/pigyuma/tree/dev/packages/react-utility-types): Utility types for React.
- [`@pigyuma/react-utils`](https://github.com/choegyumin/pigyuma/tree/dev/packages/react-utils): Custom hooks, utility components and functions for React.
- [`@pigyuma/tsconfig`](https://github.com/choegyumin/pigyuma/tree/dev/packages/tsconfig): `tsconfig.json` used throughout the monorepo.
- [`@pigyuma/ui-design-tool`](https://github.com/choegyumin/pigyuma/tree/dev/packages/ui-design-tool): API library and canvas for UI design tool like Figma.
- [`@pigyuma/utils`](https://github.com/choegyumin/pigyuma/tree/dev/packages/utils): JavaScript utility functions like Lodash.

#### Tools

- [`eslint`](https://github.com/choegyumin/pigyuma/tree/dev/tools/eslint): ESLint configuration presets.
- [`vitest`](https://github.com/choegyumin/pigyuma/tree/dev/tools/vitest): Vitest configuration helpers.
