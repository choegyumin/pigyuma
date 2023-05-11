import { UIRecordElementDataset, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { clone, nonNullable } from '@pigyuma/utils';
import { Artboard, ArtboardJSON, ArtboardData, ArtboardArgs } from '../Artboard/model';
import { ShapeLayer, ShapeLayerArgs, ShapeLayerData, ShapeLayerJSON } from '../ShapeLayer/model';
import { TextLayer, TextLayerArgs, TextLayerData, TextLayerJSON } from '../TextLayer/model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/model';

export interface CanvasJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'canvas'>;
  children: Array<ArtboardJSON | ShapeLayerJSON | TextLayerJSON>;
}

type OptionalCanvasDataKey = 'key';
type OmitCanvasDataKey = 'children';
export interface CanvasData
  extends Partial<Pick<CanvasJSON, OptionalCanvasDataKey>>,
    Omit<CanvasJSON, OptionalCanvasDataKey | OmitCanvasDataKey> {
  children: Array<ArtboardData | ShapeLayerData | TextLayerData>;
}

type OptionalCanvasArgsKey = 'key' | 'type';
type OmitCanvasArgsKey = 'children';
export interface CanvasArgs
  extends Partial<Pick<CanvasJSON, OptionalCanvasArgsKey>>,
    Omit<CanvasJSON, OptionalCanvasArgsKey | OmitCanvasArgsKey> {
  children: Array<ArtboardArgs | ShapeLayerArgs | TextLayerArgs>;
}

export class Canvas extends UIRecord implements CanvasJSON {
  static key = '#canvas' as const;
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'canvas'>;
  readonly children: Array<Artboard | ShapeLayer | TextLayer>;

  constructor(args: CanvasArgs) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.key = Canvas.key;
    superArgs.type = UIRecordType.canvas;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;

    this.children =
      args.children
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
        .filter(nonNullable) ?? [];
  }

  toJSON(): CanvasJSON {
    return {
      key: this.key,
      type: this.type,
      children: this.children.map((it) => it.toJSON()),
    };
  }

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is CanvasJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.canvas;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is Canvas | CanvasJSON {
    return object instanceof Canvas || Canvas.isJSON(object);
  }

  static isElement(element: Element | null): boolean {
    return element instanceof HTMLElement && element.dataset[UIRecordElementDataset.type] === UIRecordType.canvas;
  }

  static makeChanges(values: DeepPartial<CanvasData>, origin: CanvasData) {
    const v = UIRecord.makeChanges(values, origin) as DeepPartial<CanvasData>;
    return v;
  }
}
