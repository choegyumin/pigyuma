import { UIRecordKey, LayerType, UIRecordType, UIRecordElementDataset } from '@/types/Identifier';
import { HeightValueObject, RotateValueObject, StyleValue, WidthValueObject, XValueObject, YValueObject } from '@/types/Value';
import { convertHeightValue, convertRotateValue, convertWidthValue, convertXValue, convertYValue, fixNumberValue } from '@/utils/value';
import { clone, toDegrees360, uuid } from '@pigyuma/utils';
import { produce } from 'immer';
import { Artboard } from '../Artboard/model';
import { Canvas } from '../Canvas/model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/model';
import * as styles from './styles.css';

export interface LayerValues {
  name: string;
  x: XValueObject;
  y: YValueObject;
  width: WidthValueObject;
  height: HeightValueObject;
  rotate: RotateValueObject;
}

export interface LayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface LayerJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'layer'>;
  layerType: LayerType;
  values: LayerValues;
}

type OptionalLayerDataKey = 'key';
export interface LayerData extends Partial<Pick<LayerJSON, OptionalLayerDataKey>>, Omit<LayerJSON, OptionalLayerDataKey> {}

type OptionalLayerArgsKey = 'key' | 'type';
export interface LayerArgs extends Partial<Pick<LayerJSON, OptionalLayerArgsKey>>, Omit<LayerJSON, OptionalLayerArgsKey> {}

export class Layer extends UIRecord implements LayerJSON {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'layer'>;
  readonly layerType: LayerType;
  readonly values: Readonly<LayerValues>;
  readonly parent: Artboard | Canvas | Layer | null;

  constructor(args: LayerArgs, parent: Artboard | Canvas | Layer | null = null) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.key = superArgs.key || uuid.v4();
    superArgs.type = UIRecordType.layer;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;
    this.layerType = args.layerType;

    this.values = args.values;
    this.parent = parent;
  }

  get style(): LayerStyle {
    return Layer.getStyle(this);
  }

  static getStyle(object: Layer | LayerJSON): LayerStyle {
    return {
      [styles.varNames.x]: convertXValue(object.values.x),
      [styles.varNames.y]: convertYValue(object.values.y),
      [styles.varNames.width]: convertWidthValue(object.values.width),
      [styles.varNames.height]: convertHeightValue(object.values.height),
      [styles.varNames.rotate]: convertRotateValue(object.values.rotate),
    };
  }

  toJSON(): LayerJSON {
    return {
      key: this.key,
      type: this.type,
      layerType: this.layerType,
      values: this.values,
    };
  }

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validate(object: any): object is LayerJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.layer;
  }

  static isElement(element: Element | null): boolean {
    return element instanceof HTMLElement && element.dataset[UIRecordElementDataset.type] === UIRecordType.layer;
  }

  static makeValuesChanges(values: DeepPartial<LayerValues>, origin: LayerValues) {
    // prettier-ignore
    return produce(UIRecord.makeValuesChanges(values, origin) as unknown as LayerValues, (draft) => {
      if (values.name != null) { draft.name = values.name; }
      if (values.x?.length != null) { draft.x.length = fixNumberValue(values.x.length); }
      if (values.y?.length != null) { draft.y.length = fixNumberValue(values.y.length); }
      if (values.width?.length != null) { draft.width.length = fixNumberValue(Math.max(values.width.length, 1)); }
      if (values.height?.length != null) { draft.height.length = fixNumberValue(Math.max(values.height.length, 1)); }
      if (values.rotate?.degrees != null) { draft.rotate.degrees = fixNumberValue(toDegrees360(values.rotate.degrees)); }
    });
  }
}
