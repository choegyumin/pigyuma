import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
import { HeightLength, WidthLength, XLength, YLength } from '@/types/Unit';
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

export class Artboard extends UIRecord {
  public readonly key: UIRecordKey;
  public readonly type: Extract<UIRecordType, 'artboard'>;
  public readonly name: string;
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly parent?: Canvas;
  public readonly children: Array<ShapeLayer | TextLayer>;

  constructor(args: ArtboardArgs, parent?: Canvas) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.type = UIRecordType.artboard;
    super(superArgs);
    this.key = args.key || uuid.v4();
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
      children: [],
      parent: undefined,
    };
  }

  get style(): ArtboardStyle {
    return Artboard.getStyle(this);
  }

  static getStyle(object: Artboard | ArtboardJSON): ArtboardStyle {
    return {
      [styles.varNames.x]: convertXValue({ length: object.x, lengthType: XLength.px }),
      [styles.varNames.y]: convertYValue({ length: object.y, lengthType: YLength.px }),
      [styles.varNames.width]: convertWidthValue({ length: object.width, lengthType: WidthLength.px }),
      [styles.varNames.height]: convertHeightValue({ length: object.height, lengthType: HeightLength.px }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is ArtboardJSON {
    return (
      object instanceof Artboard ||
      (object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.artboard)
    );
  }
}
