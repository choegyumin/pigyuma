import { UIRecordKey, LayerType, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
import { clone, uuid } from '@pigyuma/utils';
import { Artboard } from '../Artboard/Artboard.model';
import { Canvas } from '../Canvas/Canvas.model';
import { UIRecord, UIRecordArgs, UIRecordJSON } from '../UIRecord/UIRecord.model';

export interface LayerJSON extends UIRecordJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'layer'>;
  layerType: LayerType;
}

export interface LayerData {
  key?: LayerJSON['key'];
  type: LayerJSON['type'];
  layerType: LayerJSON['layerType'];
}

export interface LayerArgs {
  key?: LayerData['key'];
  type?: LayerData['type'];
  layerType: LayerData['layerType'];
}

export class Layer extends UIRecord {
  public readonly key: UIRecordKey;
  public readonly type: Extract<UIRecordType, 'layer'>;
  public readonly layerType: LayerType;
  public readonly parent?: Artboard | Canvas | Layer;

  constructor(args: LayerArgs, parent?: Artboard | Canvas | Layer) {
    const superArgs = clone(args) as UIRecordArgs;
    superArgs.type = UIRecordType.layer;
    super(superArgs);
    this.key = args.key || uuid.v4();
    this.type = superArgs.type;
    this.layerType = args.layerType;
    this.parent = parent;
  }

  get tree(): UIRecordTree {
    return {
      key: this.key,
      children: [],
      parent: this.parent?.key,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is LayerJSON {
    return (
      object instanceof Layer ||
      (object != null && typeof object === 'object' && !Array.isArray(object) && object.type === UIRecordType.layer)
    );
  }
}
