export type UIRecordKey = string;

export const UIRecordType = {
  artboard: 'artboard',
  canvas: 'canvas',
  layer: 'layer',
} as const;
export type UIRecordType = keyof typeof UIRecordType;

export const CanvasKey = '#canvas' as const;
export type CanvasKey = typeof CanvasKey;

export const LayerType = {
  /** @see ShapeType */
  shape: 'shape',
  /** `display: block;` with typography style. */
  text: 'text',
} as const;
export type LayerType = keyof typeof LayerType;
