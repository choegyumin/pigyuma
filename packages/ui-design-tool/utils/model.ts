import { UIRecord, UIRecordChildrenAttributes, UIRecordJSON, UIRecordParentAttributes } from '@/components/UIRecord/UIRecord.model';
import { UIRecordKey } from '@/types/Identifier';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordKey = (object: any): object is UIRecordKey => {
  return typeof object === 'string';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithParent = (object: any): object is UIRecordJSON & UIRecordParentAttributes => {
  // 타입 검증이므로 parent가 undefined이어도 key만 있다면 존재하는 걸로 판단함
  return UIRecord.isModel(object) && Object.hasOwn(object, 'parent');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithChildren = (object: any): object is UIRecordJSON & UIRecordChildrenAttributes => {
  return UIRecord.isModel(object) && Array.isArray((object as AnyObject).children);
};
