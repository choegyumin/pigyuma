import { UIRecordKey } from '@/types/Identifier';
import { flatUIRecords } from '@/utils/convert';
import { isUIRecordKey, isUIRecordWithChildren, isUIRecordWithParent } from '@/utils/model';
import { useStableCallback } from '@pigyuma/react-utils';
import { useMemo } from 'react';
import { Canvas } from '../Canvas/Canvas.model';
import { UIRecord } from '../UIRecord/UIRecord.model';

export default function useUIRecordAPI(canvas: Canvas) {
  const records = useMemo(() => {
    return flatUIRecords([canvas]);
  }, [canvas]);

  const listeners = useMemo<Record<UIRecordKey, (value: UIRecord) => void>>(() => ({}), []);

  const subscribe = useStableCallback((recordKey: UIRecordKey, callback: <T extends UIRecord>(value: T) => void) => {
    /** @todo 하나의 Key에 여러 Callback을 등록 가능하도록 개선 */
    listeners[recordKey] = callback;
  });

  const unsubscribe = useStableCallback((recordKey: UIRecordKey): void => {
    delete listeners[recordKey];
  });

  /** @todo value를 JSON으로 받을 수 있도록 개선 (records에 주입할 때 인스턴스화) */
  const append = useStableCallback((parent: UIRecord | UIRecordKey, value: UIRecord) => {
    if (records.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists.`);
      return;
    }

    let parentValue;
    if (isUIRecordKey(parent)) {
      parentValue = records.get(parent);
      if (parentValue == null) {
        console.error(`UIRecord '${parent}' not found.`);
        return;
      }
    } else {
      parentValue = parent;
    }
    const parentKey = parentValue.key;

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }

    records.set(value.key, value);
    parentValue.children.push(value);
    listeners[parentKey]?.(parentValue);
  });

  /** @todo value를 JSON으로 받을 수 있도록 개선 (records에 주입할 때 인스턴스화) */
  const prepend = useStableCallback((parent: UIRecord | UIRecordKey, value: UIRecord) => {
    if (records.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists.`);
      return;
    }

    let parentValue;
    if (isUIRecordKey(parent)) {
      parentValue = records.get(parent);
      if (parentValue == null) {
        console.error(`UIRecord '${parent}' not found.`);
        return;
      }
    } else {
      parentValue = parent;
    }
    const parentKey = parentValue.key;

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }

    records.set(value.key, value);
    parentValue.children.unshift(value);
    listeners[parentKey]?.(parentValue);
  });

  /** @todo value를 JSON으로 받을 수 있도록 개선 (records에 주입할 때 인스턴스화) */
  const insert = useStableCallback((nextSibling: UIRecord | UIRecordKey, value: UIRecord) => {
    if (records.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists.`);
      return;
    }

    let nextSiblingValue;
    if (isUIRecordKey(nextSibling)) {
      nextSiblingValue = records.get(nextSibling);
      if (nextSiblingValue == null) {
        console.error(`UIRecord '${nextSibling}' not found.`);
        return;
      }
    } else {
      nextSiblingValue = nextSibling;
    }
    const nextSiblingKey = nextSiblingValue.key;

    if (!isUIRecordWithParent(nextSiblingValue)) {
      console.error(`parent of UIRecord '${nextSiblingKey}' not found.`);
      return;
    }

    const parentKey = nextSiblingValue.parent?.key;
    const parentValue = records.get(parentKey ?? '') || records.get(parentKey ?? '');
    if (parentKey == null || parentValue == null) {
      console.error(`UIRecord '${parentKey}' not found.`);
      return;
    }

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }

    const targetIndex = parentValue.children.findIndex((it) => it.key === nextSiblingKey);
    if (targetIndex < 0) {
      console.error(`children of UIRecord '${parentKey}' has no UIRecord '${nextSiblingKey}'.`);
      return;
    }

    records.set(value.key, value);
    parentValue.children.splice(targetIndex, 0, value);
    listeners[parentKey]?.(parentValue);
  });

  const set = useStableCallback((targetKey: UIRecordKey, value: Partial<UIRecord>): void => {
    const targetValue = records.get(targetKey);
    if (targetValue == null) {
      console.error(`UIRecord '${targetKey}' not found.`);
      return;
    }

    Object.assign(targetValue, value);
    listeners[targetKey]?.(targetValue);
  });

  const remove = useStableCallback((targetKey: UIRecordKey) => {
    const targetValue = records.get(targetKey);
    if (targetValue == null) {
      console.warn(`UIRecord '${targetKey}' not found.`);
      return;
    }

    if (!isUIRecordWithParent(targetValue) || targetValue.parent == null) {
      records.delete(targetKey);
      return;
    }

    const { parent: parentValue } = targetValue;
    const parentKey = parentValue.key;
    if (parentValue == null) {
      console.error(`UIRecord '${parentKey}' not found.`);
      return;
    }

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }

    const targetIndex = parentValue.children.findIndex((it) => it.key === targetKey);
    if (targetIndex < 0) {
      console.error(`children of UIRecord '${parentKey}' has no UIRecord '${targetKey}'.`);
      return;
    }

    records.delete(targetKey);
    parentValue.children.splice(targetIndex, 1);
    listeners[parentKey]?.(parentValue);
  });

  return {
    records,
    append,
    prepend,
    insert,
    set,
    remove,
    listeners,
    subscribe,
    unsubscribe,
  };
}
