import { UIRecordKey } from './Identifier';

export type UIRecordTree = {
  key: UIRecordKey;
  children: UIRecordKey[];
  parent?: UIRecordKey;
};
