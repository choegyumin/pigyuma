import { UIRecordElementDataset, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { HeightLengthType, WidthLengthType, XLengthType, YLengthType } from '@/types/Unit';
import { StyleValue } from '@/types/Value';
import { convertFillValue, convertHeightValue, convertWidthValue, convertXValue, convertYValue, fixNumberValue } from '@/utils/value';
import { clone, nonNullable, uuid } from '@pigyuma/utils';
import { Canvas } from '../Canvas/model';
import { ShapeLayer, ShapeLayerArgs, ShapeLayerData, ShapeLayerJSON } from '../ShapeLayer/model';
import { TextLayer, TextLayerArgs, TextLayerData, TextLayerJSON } from '../TextLayer/model';
import { UIRecord, UIRecordArgs, UIRecordChanges, UIRecordJSON } from '../UIRecord/model';
import * as styles from './styles.css';

export interface ArtboardStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface ArtboardJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'artboard'>;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
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
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly fill: string;
  readonly parent: Canvas | null;
  readonly children: Array<ShapeLayer | TextLayer>;

  constructor(args: ArtboardArgs, parent: Canvas | null = null) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.key = superArgs.key || uuid.v4();
    superArgs.type = UIRecordType.artboard;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;

    this.name = args.name;
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.fill = args.fill;
    this.parent = parent;
    this.children =
      args.children
        ?.map((it) => {
          if (it instanceof ShapeLayer || it instanceof TextLayer) {
            // Replace parent
            Object.assign(it, { parent: this });
            return it;
          }
          if (ShapeLayer.isModel(it)) {
            return new ShapeLayer(it, this);
          }
          if (TextLayer.isModel(it)) {
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
      [styles.varNames.x]: convertXValue({ length: object.x, lengthType: XLengthType.px }),
      [styles.varNames.y]: convertYValue({ length: object.y, lengthType: YLengthType.px }),
      [styles.varNames.width]: convertWidthValue({ length: object.width, lengthType: WidthLengthType.px }),
      [styles.varNames.height]: convertHeightValue({ length: object.height, lengthType: HeightLengthType.px }),
      [styles.varNames.background]: convertFillValue({ color: object.fill }),
    };
  }

  toJSON(): ArtboardJSON {
    return {
      key: this.key,
      type: this.type,
      name: this.name,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.fill,
      children: this.children.map((it) => it.toJSON()),
    };
  }

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is ArtboardJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.artboard;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is Artboard | ArtboardJSON {
    return object instanceof Artboard || Artboard.isJSON(object);
  }

  static isElement(element: Element | null): boolean {
    return element instanceof HTMLElement && element.dataset[UIRecordElementDataset.type] === UIRecordType.artboard;
  }

  static makeChanges(values: DeepPartial<ArtboardData>, origin: ArtboardData) {
    const v = UIRecord.makeChanges(values, origin) as UIRecordChanges<ArtboardData>;
    if (v.x != null) {
      v.x = fixNumberValue(v.x);
    }
    if (v.y != null) {
      v.y = fixNumberValue(v.y);
    }
    if (v.width != null) {
      v.width = fixNumberValue(Math.max(v.width, 1));
    }
    if (v.height != null) {
      v.height = fixNumberValue(Math.max(v.height, 1));
    }
    return v;
  }
}
