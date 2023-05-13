# @pigyuma/ui-design-tool

API library and canvas for UI design tool.

## Installation

```shell
yarn add @pigyuma/ui-design-tool
```

## Usage

```tsx
import UIDesignTool, {
  UIDesignCanvas,
  UIDesignToolProvider,
  useUIController,
  Artboard,
  ShapeLayer,
  TextLayer,
} from '@pigyuma/ui-design-tool';

const uiDesignTool = new UIDesignTool();

const initialData = [new Artboard(/* ... */), new ShapeLayer(/* ... */), new TextLayer(/* ... */)];

const App = () => {
  return (
    <UIDesignToolProvider api={uiDesignTool}>
      <Workspace />
    </UIDesignToolProvider>
  );
};

const Workspace = () => {
  const uiController = useUIController();

  const onClick = () => {
    uiController.set('RECORD-KEY', { name: 'Changed!' });
  };

  return (
    <>
      <UIDesignCanvas initialData={initialData} />
      <button type="button" onClick={onClick}>
        Change?
      </button>
    </>
  );
};
```

---

## Additional Documentation

In addition to the README you're reading right now, this repo includes other docs that describe the purpose in more detail:

- [ARCHITECTURE.md](https://github.com/choegyumin/pigyuma/tree/dev/packages/ui-design-tool/ARCHITECTURE.md)
