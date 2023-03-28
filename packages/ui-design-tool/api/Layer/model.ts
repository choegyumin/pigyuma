import { UIRecordKey, LayerType, UIRecordType, UIRecordElementDataset } from '@/types/Identifier';
import { HeightValueObject, RotateValueObject, StyleValue, WidthValueObject, XValueObject, YValueObject } from '@/types/Value';
import { convertHeightValue, convertRotateValue, convertWidthValue, convertXValue, convertYValue, fixNumberValue } from '@/utils/value';
import { clone, cloneDeep, merge, toDegrees360, uuid } from '@pigyuma/utils';
import { Artboard } from '../Artboard/model';
import { Canvas } from '../Canvas/model';
import { UIRecord, UIRecordArgs, UIRecordChanges, UIRecordJSON } from '../UIRecord/model';
import * as styles from './styles.css';

export interface LayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

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

type OptionalLayerDataKey = 'key';
export interface LayerData extends Partial<Pick<LayerJSON, OptionalLayerDataKey>>, Omit<LayerJSON, OptionalLayerDataKey> {}

type OptionalLayerArgsKey = 'key' | 'type';
export interface LayerArgs extends Partial<Pick<LayerJSON, OptionalLayerArgsKey>>, Omit<LayerJSON, OptionalLayerArgsKey> {}

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

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is LayerJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.layer;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is Layer | LayerJSON {
    return object instanceof Layer || Layer.isJSON(object);
  }

  static isElement(element: Element | null): boolean {
    return element instanceof HTMLElement && element.dataset[UIRecordElementDataset.type] === UIRecordType.layer;
  }

  static makeChanges(values: DeepPartial<LayerData>, origin: LayerData) {
    const v = UIRecord.makeChanges(values, origin) as UIRecordChanges<LayerData>;
    if (v.x != null) {
      v.x = merge(cloneDeep(origin.x), v.x);
      if (v.x.length != null) {
        v.x.length = fixNumberValue(v.x.length);
      }
    }
    if (v.y != null) {
      v.y = merge(cloneDeep(origin.y), v.y);
      if (v.y.length != null) {
        v.y.length = fixNumberValue(v.y.length);
      }
    }
    if (v.width != null) {
      v.width = merge(cloneDeep(origin.width), v.width);
      if (v.width.length != null) {
        v.width.length = fixNumberValue(Math.max(v.width.length, 1));
      }
    }
    if (v.height != null) {
      v.height = merge(cloneDeep(origin.height), v.height);
      if (v.height.length != null) {
        v.height.length = fixNumberValue(Math.max(v.height.length, 1));
      }
    }
    if (v.rotate != null) {
      v.rotate = merge(cloneDeep(origin.rotate), v.rotate);
      if (v.rotate.degrees != null) {
        v.rotate.degrees = fixNumberValue(toDegrees360(v.rotate.degrees));
      }
    }
    return v;
  }
}
