import { UIRecordKey, LayerType, UIRecordType, UIRecordElementDataset } from '@/types/Identifier';
import {
  FillValueObject,
  HeightValueObject,
  RotateValueObject,
  StrokeValueObject,
  StyleValue,
  WidthValueObject,
  XValueObject,
  YValueObject,
} from '@/types/Value';
import {
  convertFillValue,
  convertHeightValue,
  convertRotateValue,
  convertStrokeColorValue,
  convertStrokePatternValue,
  convertStrokeWidthValue,
  convertWidthValue,
  convertXValue,
  convertYValue,
  fixNumberValue,
} from '@/utils/value';
import { clone, nonNullable, uuid } from '@pigyuma/utils';
import { produce } from 'immer';
import React from 'react';
import { Artboard } from '../Artboard/model';
import { Canvas } from '../Canvas/model';
import { Layer, LayerArgs, LayerJSON } from '../Layer/model';
import { TextLayer, TextLayerArgs, TextLayerData, TextLayerJSON } from '../TextLayer/model';
import * as styles from './styles.css';

export interface ShapeLayerValues {
  name: string;
  x: XValueObject;
  y: YValueObject;
  width: WidthValueObject;
  height: HeightValueObject;
  rotate: RotateValueObject;
  stroke: StrokeValueObject;
  fill: FillValueObject;
}

export interface ShapeLayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export const ShapeType = {
  /** `display: block;`. It behaves as `position: absolute;`, If inside Stack */
  container: 'container',
  /** `display: block; position: relative;`. */
  stack: 'stack',
  /** `display: flex; flex-direction: rows;`. */
  columns: 'columns',
  /** `display: flex; flex-direction: columns;`. */
  rows: 'rows',
  /** `display: grid;`. */
  grid: 'grid',
} as const;
export type ShapeType = keyof typeof ShapeType;

export interface ShapeLayerJSON extends LayerJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'layer'>;
  layerType: Extract<LayerType, 'shape'>;
  shapeType: ShapeType;
  values: ShapeLayerValues;
  children: Array<ShapeLayerJSON | TextLayerJSON>;
}

type OptionalShapeLayerDataKey = 'key';
type OmitShapeLayerDataKey = 'children';
export interface ShapeLayerData
  extends Partial<Pick<ShapeLayerJSON, OptionalShapeLayerDataKey>>,
    Omit<ShapeLayerJSON, OptionalShapeLayerDataKey | OmitShapeLayerDataKey> {
  children: Array<ShapeLayerData | TextLayerData>;
}

type OptionalShapeLayerArgsKey = 'key' | 'type' | 'layerType';
type OmitShapeLayerArgsKey = 'children';
export interface ShapeLayerArgs
  extends Partial<Pick<ShapeLayerJSON, OptionalShapeLayerArgsKey>>,
    Omit<ShapeLayerJSON, OptionalShapeLayerArgsKey | OmitShapeLayerArgsKey> {
  children: Array<ShapeLayerArgs | TextLayerArgs>;
}

export class ShapeLayer extends Layer implements ShapeLayerJSON {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'layer'>;
  readonly layerType: Extract<LayerType, 'shape'>;
  readonly shapeType: ShapeType;
  readonly values: Readonly<ShapeLayerValues>;
  readonly parent: Artboard | Canvas | ShapeLayer | null;
  readonly children: Array<ShapeLayer | TextLayer>;

  constructor(args: ShapeLayerArgs, parent: Artboard | Canvas | ShapeLayer | null = null) {
    const superArgs = clone(args) as LayerArgs;
    superArgs.key = superArgs.key || uuid.v4();
    superArgs.type = UIRecordType.layer;
    superArgs.layerType = LayerType.shape;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;
    this.layerType = superArgs.layerType;

    this.shapeType = args.shapeType;
    this.values = args.values;
    this.parent = parent;
    this.children =
      args.children
        ?.map((it) => {
          if (it instanceof ShapeLayer || it instanceof TextLayer) {
            // Replace parent
            Object.assign(it, { parent: this });
            return it;
          }
          if (TextLayer.validate(it)) {
            return new TextLayer(it, this);
          }
          if (ShapeLayer.validate(it)) {
            return new ShapeLayer(it, this);
          }
          return null;
        })
        .filter(nonNullable) ?? [];
  }

  get style(): ShapeLayerStyle {
    return ShapeLayer.getStyle(this);
  }

  static getStyle(object: ShapeLayer | ShapeLayerJSON): ShapeLayerStyle {
    return {
      [styles.varNames.x]: convertXValue(object.values.x),
      [styles.varNames.y]: convertYValue(object.values.y),
      [styles.varNames.width]: convertWidthValue(object.values.width),
      [styles.varNames.height]: convertHeightValue(object.values.height),
      [styles.varNames.rotate]: convertRotateValue(object.values.rotate),
      [styles.varNames.strokeColor]: convertStrokeColorValue(object.values.stroke),
      [styles.varNames.strokePattern]: convertStrokePatternValue(object.values.stroke),
      [styles.varNames.strokeWidth]: convertStrokeWidthValue(object.values.stroke),
      [styles.varNames.background]: convertFillValue(object.values.fill),
    };
  }

  toJSON(): ShapeLayerJSON {
    return {
      key: this.key,
      type: this.type,
      layerType: this.layerType,
      shapeType: this.shapeType,
      values: this.values,
      children: this.children.map((it) => it.toJSON()),
    };
  }

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validate(object: any): object is ShapeLayerJSON {
    return (
      object != null &&
      typeof object === 'object' &&
      !Array.isArray(object) &&
      object.type === UIRecordType.layer &&
      object.layerType === LayerType.shape
    );
  }

  static isElement(element: Element | null): boolean {
    return (
      element instanceof HTMLElement &&
      element.dataset[UIRecordElementDataset.type] === UIRecordType.layer &&
      element.dataset[UIRecordElementDataset.layerType] === LayerType.shape
    );
  }

  static makeValuesChanges(values: DeepPartial<ShapeLayerValues>, origin: ShapeLayerValues) {
    // prettier-ignore
    return produce(Layer.makeValuesChanges(values, origin) as unknown as ShapeLayerValues, (draft) => {
      if (values.stroke?.color != null) { draft.stroke.color = values.stroke.color; }
      if (values.stroke?.pattern != null) { draft.stroke.pattern = values.stroke.pattern; }
      if (values.stroke?.width?.top != null) { draft.stroke.width.top = fixNumberValue(Math.max(values.stroke.width.top, 0)); }
      if (values.stroke?.width?.right != null) { draft.stroke.width.right = fixNumberValue(Math.max(values.stroke.width.right, 0)); }
      if (values.stroke?.width?.bottom != null) { draft.stroke.width.bottom = fixNumberValue(Math.max(values.stroke.width.bottom, 0)); }
      if (values.stroke?.width?.left != null) { draft.stroke.width.left = fixNumberValue(Math.max(values.stroke.width.left, 0)); }
      if (values.fill?.color != null) { draft.fill.color = values.fill.color; }
    });
  }
}
