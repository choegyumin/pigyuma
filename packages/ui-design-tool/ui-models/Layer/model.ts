import { UIRecordKey, LayerType, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
import { HeightValueObject, RotateValueObject, StyleValue, WidthValueObject, XValueObject, YValueObject } from '@/types/Value';
import { convertHeightValue, convertRotateValue, convertWidthValue, convertXValue, convertYValue } from '@/utils/value';
import { clone, uuid } from '@pigyuma/utils';
import { Artboard } from '../Artboard/model';
import { Canvas } from '../Canvas/model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/model';
import * as styles from './styles.css';

export interface LayerJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'layer'>;
  layerType: LayerType;
  name: string;
  x: XValueObject;
  y: YValueObject;
  width: WidthValueObject;
  height: HeightValueObject;
  rotate: RotateValueObject;
}

export interface LayerData {
  key?: LayerJSON['key'];
  type: LayerJSON['type'];
  layerType: LayerJSON['layerType'];
  name: LayerJSON['name'];
  x: LayerJSON['x'];
  y: LayerJSON['y'];
  width: LayerJSON['width'];
  height: LayerJSON['height'];
  rotate: LayerJSON['rotate'];
}

export interface LayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface LayerArgs {
  key?: LayerData['key'];
  type?: LayerData['type'];
  layerType: LayerData['layerType'];
  name: LayerData['name'];
  x: LayerData['x'];
  y: LayerData['y'];
  width: LayerData['width'];
  height: LayerData['height'];
  rotate: LayerData['rotate'];
}

export class Layer extends UIRecord implements LayerJSON {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'layer'>;
  readonly layerType: LayerType;
  readonly name: string;
  readonly x: XValueObject;
  readonly y: YValueObject;
  readonly width: WidthValueObject;
  readonly height: HeightValueObject;
  readonly rotate: RotateValueObject;
  readonly parent: Artboard | Canvas | Layer | null;

  constructor(args: LayerArgs, parent: Artboard | Canvas | Layer | null = null) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.key = superArgs.key || uuid.v4();
    superArgs.type = UIRecordType.layer;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;
    this.layerType = args.layerType;

    this.name = args.name;
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.rotate = args.rotate;
    this.parent = parent;
  }

  get tree(): UIRecordTree {
    return {
      key: this.key,
      children: [],
      parent: this.parent?.key,
    };
  }

  get style(): LayerStyle {
    return Layer.getStyle(this);
  }

  static getStyle(object: Layer | LayerJSON): LayerStyle {
    return {
      [styles.varNames.x]: convertXValue(object.x),
      [styles.varNames.y]: convertYValue(object.y),
      [styles.varNames.width]: convertWidthValue(object.width),
      [styles.varNames.height]: convertHeightValue(object.height),
      [styles.varNames.rotate]: convertRotateValue(object.rotate),
    };
  }

  toJSON(): LayerJSON {
    return {
      key: this.key,
      type: this.type,
      layerType: this.layerType,
      name: this.name,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotate: this.rotate,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is LayerJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.layer;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is Layer | LayerJSON {
    return object instanceof Layer || Layer.isJSON(object);
  }
}
