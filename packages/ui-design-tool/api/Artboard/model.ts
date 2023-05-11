import { UIRecordElementDataset, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { HeightLengthType, WidthLengthType, XLengthType, YLengthType } from '@/types/Unit';
import { StyleValue } from '@/types/Value';
import { convertFillValue, convertHeightValue, convertWidthValue, convertXValue, convertYValue, fixNumberValue } from '@/utils/value';
import { clone, nonNullable, uuid } from '@pigyuma/utils';
import { produce } from 'immer';
import { Canvas } from '../Canvas/model';
import { ShapeLayer, ShapeLayerArgs, ShapeLayerData, ShapeLayerJSON } from '../ShapeLayer/model';
import { TextLayer, TextLayerArgs, TextLayerData, TextLayerJSON } from '../TextLayer/model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/model';
import * as styles from './styles.css';

export interface ArtboardValues {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export interface ArtboardStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface ArtboardJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'artboard'>;
  values: ArtboardValues;
  children: Array<ShapeLayerJSON | TextLayerJSON>;
}

type OptionalArtboardDataKey = 'key';
type OmitArtboardDataKey = 'children';
export interface ArtboardData
  extends Partial<Pick<ArtboardJSON, OptionalArtboardDataKey>>,
    Omit<ArtboardJSON, OptionalArtboardDataKey | OmitArtboardDataKey> {
  children: Array<ShapeLayerData | TextLayerData>;
}

type OptionalArtboardArgsKey = 'key' | 'type';
type OmitArtboardArgsKey = 'children';
export interface ArtboardArgs
  extends Partial<Pick<ArtboardJSON, OptionalArtboardArgsKey>>,
    Omit<ArtboardJSON, OptionalArtboardArgsKey | OmitArtboardArgsKey> {
  children: Array<ShapeLayerArgs | TextLayerArgs>;
}

export class Artboard extends UIRecord implements ArtboardJSON {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'artboard'>;
  readonly values: Readonly<ArtboardValues>;
  readonly parent: Canvas | null;
  readonly children: Array<ShapeLayer | TextLayer>;

  constructor(args: ArtboardArgs, parent: Canvas | null = null) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.key = superArgs.key || uuid.v4();
    superArgs.type = UIRecordType.artboard;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;

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
          if (ShapeLayer.validate(it)) {
            return new ShapeLayer(it, this);
          }
          if (TextLayer.validate(it)) {
            return new TextLayer(it, this);
          }
          return null;
        })
        .filter(nonNullable) ?? [];
  }

  get style(): ArtboardStyle {
    return Artboard.getStyle(this);
  }

  static getStyle(object: Artboard | ArtboardJSON): ArtboardStyle {
    return {
      [styles.varNames.x]: convertXValue({ length: object.values.x, lengthType: XLengthType.px }),
      [styles.varNames.y]: convertYValue({ length: object.values.y, lengthType: YLengthType.px }),
      [styles.varNames.width]: convertWidthValue({ length: object.values.width, lengthType: WidthLengthType.px }),
      [styles.varNames.height]: convertHeightValue({ length: object.values.height, lengthType: HeightLengthType.px }),
      [styles.varNames.background]: convertFillValue({ color: object.values.fill }),
    };
  }

  toJSON(): ArtboardJSON {
    return {
      key: this.key,
      type: this.type,
      values: this.values,
      children: this.children.map((it) => it.toJSON()),
    };
  }

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validate(object: any): object is ArtboardJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.artboard;
  }

  static isElement(element: Element | null): boolean {
    return element instanceof HTMLElement && element.dataset[UIRecordElementDataset.type] === UIRecordType.artboard;
  }

  static makeValuesChanges(values: DeepPartial<ArtboardValues>, origin: ArtboardValues) {
    // prettier-ignore
    return produce(UIRecord.makeValuesChanges(values, origin) as unknown as ArtboardValues, (draft) => {
      if (values.name != null) { draft.name = values.name; }
      if (values.x != null) { draft.x = fixNumberValue(values.x); }
      if (values.y != null) { draft.y = fixNumberValue(values.y); }
      if (values.width != null) { draft.width = fixNumberValue(Math.max(values.width, 1)); }
      if (values.height != null) { draft.height = fixNumberValue(Math.max(values.height, 1)); }
      if (values.fill != null) { draft.fill = values.fill; }
    });
  }
}
