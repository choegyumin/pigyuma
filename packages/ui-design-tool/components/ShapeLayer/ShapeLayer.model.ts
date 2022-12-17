import { UIRecordKey, LayerType, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
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
} from '@/utils/convert';
import { clone, uuid } from '@pigyuma/utils';
import React from 'react';
import { Artboard } from '../Artboard/Artboard.model';
import { Canvas } from '../Canvas/Canvas.model';
import { Layer, LayerArgs, LayerJSON } from '../Layer/Layer.model';
import { TextLayerData, TextLayer, TextLayerJSON } from '../TextLayer/TextLayer.model';
import * as styles from './ShapeLayer.css';

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
  name: string;
  shapeType: ShapeType;
  x: XValueObject;
  y: YValueObject;
  width: WidthValueObject;
  height: HeightValueObject;
  rotate: RotateValueObject;
  stroke: StrokeValueObject;
  fill: FillValueObject;
  children: Array<ShapeLayerJSON | TextLayerJSON>;
}

export interface ShapeLayerData {
  key?: ShapeLayerJSON['key'];
  type: ShapeLayerJSON['type'];
  layerType: ShapeLayerJSON['layerType'];
  name: ShapeLayerJSON['name'];
  shapeType: ShapeLayerJSON['shapeType'];
  x: ShapeLayerJSON['x'];
  y: ShapeLayerJSON['y'];
  width: ShapeLayerJSON['width'];
  height: ShapeLayerJSON['height'];
  rotate: ShapeLayerJSON['rotate'];
  stroke: ShapeLayerJSON['stroke'];
  fill: ShapeLayerJSON['fill'];
  children: Array<ShapeLayerData | TextLayerData>;
}

export interface ShapeLayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface ShapeLayerArgs {
  key?: ShapeLayerData['key'];
  type?: ShapeLayerData['type'];
  layerType?: ShapeLayerData['layerType'];
  name: ShapeLayerData['name'];
  shapeType: ShapeLayerData['shapeType'];
  x: ShapeLayerData['x'];
  y: ShapeLayerData['y'];
  width: ShapeLayerData['width'];
  height: ShapeLayerData['height'];
  rotate: ShapeLayerData['rotate'];
  stroke: ShapeLayerData['stroke'];
  fill: ShapeLayerData['fill'];
  children: ShapeLayerData['children'];
}

export class ShapeLayer extends Layer implements ShapeLayer {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'layer'>;
  readonly layerType: Extract<LayerType, 'shape'>;
  readonly name: string;
  readonly shapeType: ShapeType;
  readonly x: XValueObject;
  readonly y: YValueObject;
  readonly width: WidthValueObject;
  readonly height: HeightValueObject;
  readonly rotate: RotateValueObject;
  readonly stroke: StrokeValueObject;
  readonly fill: FillValueObject;
  readonly parent: Artboard | Canvas | Layer | null;
  readonly children: Array<ShapeLayer | TextLayer>;

  constructor(args: ShapeLayerArgs, parent: Artboard | Canvas | Layer | null = null) {
    const superArgs = clone(args) as LayerArgs;
    superArgs.key = superArgs.key || uuid.v4();
    superArgs.type = UIRecordType.layer;
    superArgs.layerType = LayerType.shape;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;
    this.layerType = superArgs.layerType;

    this.name = args.name;
    this.shapeType = args.shapeType;
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.rotate = args.rotate;
    this.stroke = args.stroke;
    this.fill = args.fill;
    this.parent = parent;
    this.children =
      (args.children
        ?.map((it) => {
          if (it instanceof ShapeLayer || it instanceof TextLayer) {
            // Replace parent
            Object.assign(it, { parent: this });
            return it;
          }
          if (TextLayer.isModel(it)) {
            return new TextLayer(it, this);
          }
          if (ShapeLayer.isModel(it)) {
            return new ShapeLayer(it, this);
          }
          return null;
        })
        .filter(Boolean) as typeof this.children) ?? [];
  }

  get tree(): UIRecordTree {
    return {
      key: this.key,
      children: this.children.map((it) => it.key),
      parent: this.parent?.key,
    };
  }

  get style(): ShapeLayerStyle {
    return ShapeLayer.getStyle(this);
  }

  static getStyle(object: ShapeLayer | ShapeLayerJSON): ShapeLayerStyle {
    return {
      [styles.varNames.x]: convertXValue(object.x),
      [styles.varNames.y]: convertYValue(object.y),
      [styles.varNames.width]: convertWidthValue(object.width),
      [styles.varNames.height]: convertHeightValue(object.height),
      [styles.varNames.rotate]: convertRotateValue(object.rotate),
      [styles.varNames.strokeColor]: convertStrokeColorValue(object.stroke),
      [styles.varNames.strokePattern]: convertStrokePatternValue(object.stroke),
      [styles.varNames.strokeWidth]: convertStrokeWidthValue(object.stroke),
      [styles.varNames.background]: convertFillValue(object.fill),
    };
  }

  toJSON(): ShapeLayerJSON {
    return {
      key: this.key,
      type: this.type,
      layerType: this.layerType,
      name: this.name,
      shapeType: this.shapeType,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotate: this.rotate,
      stroke: this.stroke,
      fill: this.fill,
      children: this.children.map((it) => it.toJSON()),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is ShapeLayerJSON {
    return (
      object != null &&
      typeof object === 'object' &&
      !Array.isArray(object) &&
      object.type === UIRecordType.layer &&
      object.layerType === LayerType.shape
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is ShapeLayer | ShapeLayerJSON {
    return object instanceof ShapeLayer || ShapeLayer.isJSON(object);
  }
}
