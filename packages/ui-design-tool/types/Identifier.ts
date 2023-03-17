export type UIRecordKey = string;

export const UIRecordType = {
  artboard: 'artboard',
  canvas: 'canvas',
  layer: 'layer',
} as const;
export type UIRecordType = keyof typeof UIRecordType;

export const LayerType = {
  /** @see ShapeType */
  shape: 'shape',
  /** `display: block;` with typography style. */
  text: 'text',
} as const;
export type LayerType = keyof typeof LayerType;

export const UIRecordIdentifiers = {
  key: 'key',
  type: 'type',
  layerType: 'layerType',
  selected: 'selected',
} as const;
export type UIRecordIdentifiers = keyof typeof UIRecordIdentifiers;

export type UIRecordElementFilterItem = {
  key?: string;
  type?: string | string[];
  layerType?: string | string[];
  selected?: boolean;
};
export type UIRecordElementFilter = UIRecordElementFilterItem | UIRecordElementFilterItem[];

export const UIRecordElementDataAttributeName = {
  key: 'data-ui-record-key',
  type: 'data-ui-record-type',
  layerType: 'data-ui-record-layer-type',
  selected: 'data-ui-record-selected',
} as const;

export const UIRecordElementDataset = {
  key: 'uiRecordKey',
  type: 'uiRecordType',
  layerType: 'uiRecordLayerType',
  selected: 'uiRecordSelected',
} as const;

export const UIInteractionElementDataAttributeName = {
  handleType: 'data-ui-interaction-handle-type',
  handlePlacement: 'data-ui-interaction-handle-placement',
} as const;

export const UIInteractionElementDataset = {
  handleType: 'uiInteractionHandleType',
  handlePlacement: 'uiInteractionHandlePlacement',
} as const;

export const UIDesignToolIDAttributeName = 'data-ui-design-tool-id';
