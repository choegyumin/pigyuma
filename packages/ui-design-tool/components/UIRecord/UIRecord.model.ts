import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';

export interface UIRecordParentAttributes {
  parent?: UIRecord;
}

export interface UIRecordChildrenAttributes {
  children: UIRecord[];
}

export interface UIRecordJSON {
  key: UIRecordKey;
  type: UIRecordType;
}

export interface UIRecordData {
  key?: UIRecordJSON['key'];
  type: UIRecordJSON['type'];
}

export interface UIRecordArgs {
  key?: UIRecordData['key'];
  type: UIRecordData['type'];
}

export class UIRecord implements UIRecordJSON {
  public readonly key: UIRecordKey;
  public readonly type: UIRecordType;

  constructor(args: UIRecordArgs) {
    this.key = args.key || uuid.v4();
    this.type = args.type;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is UIRecordJSON {
    return (
      object instanceof UIRecord ||
      (object != null && typeof object === 'object' && !Array.isArray(object) && Object.values(UIRecordType).includes(object.type))
    );
  }
}
