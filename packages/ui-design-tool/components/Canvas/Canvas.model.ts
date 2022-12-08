import { CanvasKey, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
import { clone } from '@pigyuma/utils';
import { Artboard, ArtboardJSON, ArtboardData } from '../Artboard/Artboard.model';
import { LayerData } from '../Layer/Layer.model';
import { ShapeLayer, ShapeLayerJSON } from '../ShapeLayer/ShapeLayer.model';
import { TextLayer, TextLayerJSON } from '../TextLayer/TextLayer.model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/UIRecord.model';

export interface CanvasJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'canvas'>;
  children: Array<ArtboardJSON | ShapeLayerJSON | TextLayerJSON>;
}

export interface UIRecordData {
  key?: CanvasJSON['key'];
  type?: CanvasJSON['type'];
  children: Array<ArtboardData | LayerData>;
}

export interface CanvasArgs {
  key?: UIRecordData['key'];
  type?: UIRecordData['type'];
  children: UIRecordData['children'];
}

export class Canvas extends UIRecord {
  public readonly key: UIRecordKey;
  public readonly type: Extract<UIRecordType, 'canvas'>;
  public readonly parent?: undefined;
  public readonly children: Array<Artboard | ShapeLayer | TextLayer>;

  constructor(args: CanvasArgs, parent?: undefined) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.key = CanvasKey;
    superArgs.type = UIRecordType.canvas;
    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;
    this.parent = parent;
    this.children =
      (args.children
        ?.map((it) => {
          if (it instanceof Artboard || it instanceof ShapeLayer || it instanceof TextLayer) {
            return it;
          }
          if (Artboard.isModel(it)) {
            return new Artboard(it, this);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is CanvasJSON {
    return (
      object instanceof Canvas ||
      (object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.canvas)
    );
  }
}
