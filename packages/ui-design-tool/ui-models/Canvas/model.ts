import { CanvasKey, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
import { clone } from '@pigyuma/utils';
import { Artboard, ArtboardJSON, ArtboardData } from '../Artboard/model';
import { LayerData } from '../Layer/model';
import { ShapeLayer, ShapeLayerJSON } from '../ShapeLayer/model';
import { TextLayer, TextLayerJSON } from '../TextLayer/model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/model';

export interface CanvasJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'canvas'>;
  children: Array<ArtboardJSON | ShapeLayerJSON | TextLayerJSON>;
}

export interface CanvasData {
  key?: CanvasJSON['key'];
  type?: CanvasJSON['type'];
  children: Array<ArtboardData | LayerData>;
}

export interface CanvasArgs {
  key?: CanvasData['key'];
  type?: CanvasData['type'];
  children: CanvasData['children'];
}

export class Canvas extends UIRecord implements CanvasJSON {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'canvas'>;
  readonly children: Array<Artboard | ShapeLayer | TextLayer>;

  constructor(args: CanvasArgs) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.key = CanvasKey;
    superArgs.type = UIRecordType.canvas;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;

    this.children =
      (args.children
        ?.map((it) => {
          if (it instanceof Artboard || it instanceof ShapeLayer || it instanceof TextLayer) {
            // Replace parent
            Object.assign(it, { parent: this });
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
      children: this.children.map((it) => it.key),
      parent: undefined,
    };
  }

  toJSON(): CanvasJSON {
    return {
      key: this.key,
      type: this.type,
      children: this.children.map((it) => it.toJSON()),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is CanvasJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.canvas;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is Canvas | CanvasJSON {
    return object instanceof Canvas || Canvas.isJSON(object);
  }
}
