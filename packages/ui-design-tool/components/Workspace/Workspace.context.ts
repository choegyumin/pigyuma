import { UIRecordKey } from '@/types/Identifier';
import { createContext } from 'react';
import { UIRecord } from '../UIRecord/UIRecord.model';

export type WorkspaceContextValue = {
  records: Map<UIRecordKey, UIRecord>;
  append: <T extends UIRecord>(parent: UIRecord | UIRecordKey, value: T) => void;
  prepend: <T extends UIRecord>(parent: UIRecord | UIRecordKey, value: T) => void;
  insert: <T extends UIRecord>(nextSibling: UIRecord | UIRecordKey, value: T) => void;
  set: <T extends UIRecord>(targetKey: UIRecordKey, value: Partial<T>) => void;
  remove: (targetKey: UIRecordKey) => void;
  listeners: Record<UIRecordKey, (value: UIRecord) => void>;
  subscribe: (targetKey: UIRecordKey, callback: (value: UIRecord) => void) => void;
  unsubscribe: (targetKey: UIRecordKey) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextValue>({
  records: new Map(),
  append: () => undefined,
  prepend: () => undefined,
  insert: () => undefined,
  set: () => undefined,
  remove: () => undefined,
  listeners: {},
  subscribe: () => undefined,
  unsubscribe: () => undefined,
});
