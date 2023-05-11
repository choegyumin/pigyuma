import { UIRecordElementDataset, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';

export interface UIRecordJSON {
  key: UIRecordKey;
  type: UIRecordType;
}

type OptionalUIRecordDataKey = 'key';
export interface UIRecordData extends Partial<Pick<UIRecordJSON, OptionalUIRecordDataKey>>, Omit<UIRecordJSON, OptionalUIRecordDataKey> {}

type OptionalUIRecordArgsKey = 'key';
export interface UIRecordArgs extends Partial<Pick<UIRecordJSON, OptionalUIRecordArgsKey>>, Omit<UIRecordJSON, OptionalUIRecordArgsKey> {}

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

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validate(object: any): object is UIRecordJSON {
    return object != null && typeof object === 'object' && !Array.isArray(object) && Object.values(UIRecordType).includes(object.type);
  }

  static isElement(element: Element | null): boolean {
    return element instanceof HTMLElement && element.dataset[UIRecordElementDataset.type] != null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static makeChanges(values: DeepPartial<UIRecordData>, origin: UIRecordData) {
    return { ...values };
  }
}
