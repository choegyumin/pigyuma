# Architecture of @pigyuma/ui-design-tool

<!-- @todo -->

- API: `UIDesignTool`
- Models: `Artboard`, `ShapeLayer`, `TextLayer`
- Renderer: `UIDesignToolProvider`, `UIDesignCanvas`, React custom hooks

```ts
/* index.ts */

export { UIDesignTool as default } from './api/UIDesignTool';
export type { UIDesignToolConfig, UIDesignToolConstructor } from './api/UIDesignTool';
export { UIDesignToolProvider } from './renderer/components/UIDesignToolProvider/UIDesignToolProvider';

export * from './models/Artboard/model';
export * from './models/Canvas/model';
export * from './models/Layer/model';
export * from './models/ShapeLayer/model';
export * from './models/TextLayer/model';
export * from './models/UIRecord/model';

export { UIDesignCanvas as UIDesignCanvas } from './renderer/components/UIDesignCanvas/UIDesignCanvas';
export type { UIDesignCanvasProps, UIDesignCanvasRef } from './renderer/components/UIDesignCanvas/types';

export { default as useUIController } from './renderer/hooks/useUIController';
export { default as useUIData } from './renderer/hooks/useUIData';
export { default as useUISelector } from './renderer/hooks/useUISelector';
export { default as useUISubscriber } from './renderer/hooks/useUISubscriber';
export { default as useUIRecord } from './renderer/hooks/useUIRecord';
```
