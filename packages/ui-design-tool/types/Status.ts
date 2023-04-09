export const UIDesignToolMode = {
  /** Select & Move */
  select: 'select',
  artboard: 'artboard',
  /** Rectangle, ... */
  shape: 'shape',
  text: 'text',
  hand: 'hand',
} as const;
export type UIDesignToolMode = keyof typeof UIDesignToolMode;

/** * @see 플로우차트 (XState를 사용하진 않음) {@link https://stately.ai/viz/6a265ced-0d2c-4412-9088-f511f6105e2e} */
export const UIDesignToolStatus = {
  idle: 'idle',
  /** Range selection */
  selection: 'selection',
  drawing: 'drawing',
  input: 'input',
  moving: 'moving',
  resizing: 'resizing',
  rotating: 'rotating',
} as const;
export type UIDesignToolStatus = keyof typeof UIDesignToolStatus;

export const UIDesignToolInteractionType = {
  idle: 'idle',
  selection: 'selection',
  drawing: 'drawing',
  input: 'input',
  transform: 'transform',
} as const;
export type UIDesignToolInteractionType = keyof typeof UIDesignToolInteractionType;

export const UIDesignToolTransformMethod = {
  unable: 'unable',
  move: 'move',
  resize: 'resize',
  rotate: 'rotate',
} as const;
export type UIDesignToolTransformMethod = keyof typeof UIDesignToolTransformMethod;

export interface UIDesignToolStatusMetadata {
  interactionType: UIDesignToolInteractionType;
  transformMethod: UIDesignToolTransformMethod;
}
