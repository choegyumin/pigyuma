import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
import { HeightLengthType, WidthLengthType, XLengthType, YLengthType } from '@/types/Unit';
import { StyleValue } from '@/types/Value';
import { convertHeightValue, convertWidthValue, convertXValue, convertYValue } from '@/utils/convert';
import { clone, uuid } from '@pigyuma/utils';
import { Canvas } from '../Canvas/Canvas.model';
import { ShapeLayerData, ShapeLayer, ShapeLayerJSON } from '../ShapeLayer/ShapeLayer.model';
import { TextLayerData, TextLayer, TextLayerJSON } from '../TextLayer/TextLayer.model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/UIRecord.model';
import * as styles from './Artboard.css';

export interface ArtboardJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'artboard'>;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children: Array<ShapeLayerJSON | TextLayerJSON>;
}

export interface ArtboardData {
  key?: ArtboardJSON['key'];
  type: ArtboardJSON['type'];
  name: ArtboardJSON['name'];
  x: ArtboardJSON['x'];
  y: ArtboardJSON['y'];
  width: ArtboardJSON['width'];
  height: ArtboardJSON['height'];
  children: Array<ShapeLayerData | TextLayerData>;
}

export interface ArtboardStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface ArtboardArgs {
  key?: ArtboardData['key'];
  type?: ArtboardData['type'];
  name: ArtboardData['name'];
  x: ArtboardData['x'];
  y: ArtboardData['y'];
  width: ArtboardData['width'];
  height: ArtboardData['height'];
  children: Array<ShapeLayerData | TextLayerData>;
}

export class Artboard extends UIRecord implements Artboard {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'artboard'>;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
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
    this.parent = parent;
    this.children =
      (args.children
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
        .filter(Boolean) as typeof this.children) ?? [];
  }

  get tree(): UIRecordTree {
    return {
      key: this.key,
      children: this.children.map((it) => it.key),
      parent: this.parent?.key,
    };
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
      children: this.children.map((it) => it.toJSON()),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is ArtboardJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.artboard;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is Artboard | ArtboardJSON {
    return object instanceof Artboard || Artboard.isJSON(object);
  }
}