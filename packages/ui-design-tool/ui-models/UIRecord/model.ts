import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';

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
  readonly key: UIRecordKey;
  readonly type: UIRecordType;

  constructor(args: UIRecordArgs) {
    this.key = args.key || uuid.v4();
    this.type = args.type;
  }

  toJSON(): UIRecordJSON {
    return {
      key: this.key,
      type: this.type,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isJSON(object: any): object is UIRecordJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && Object.values(UIRecordType).includes(object.type);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is UIRecord | UIRecordJSON {
    return object instanceof UIRecord || UIRecord.isJSON(object);
  }
}
