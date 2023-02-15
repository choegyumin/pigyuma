import { Canvas } from '@/api/Canvas/model';
import { Layer } from '@/api/Layer/model';
import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { UIRecord, UIRecordData } from '@/api/UIRecord/model';
import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { UIRecordElementDataset, UIRecordElementFilter, UIRecordElementFilterItem, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { flatUIRecords, hasUIRecordParent, isUIRecordWithChildren, toUIRecordInstance } from '@/utils/model';
import { createUIRecordSelector, NULL_ELEMENT_SELECTOR } from '@/utils/selector';
import { setRef, useEvent, useEventListener, useStableCallback } from '@pigyuma/react-utils';
import { cloneDeep, nonNullable } from '@pigyuma/utils';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { WorkspaceStatus } from './types';

/**
 * @todo API 제공 방식 변경 후 중복 로직 삭제
 * @see UIDesignTool {@link @/api/UIDesignTool.ts}
 */
export default function useContextValue(initialValues: { canvas: Canvas; elementRef: React.RefObject<HTMLDivElement> }) {
  const { canvas, elementRef } = initialValues;

  const mousePointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modifierKeysRef = useRef<{ alt: boolean; ctrl: boolean; meta: boolean; shift: boolean }>({
    alt: false,
    ctrl: false,
    meta: false,
    shift: false,
  });

  const getBrowserMeta = useCallback(
    () => ({
      mouse: mousePointRef.current,
      keyboard: modifierKeysRef.current,
    }),
    [],
  );

  const [cursor, setCursor] = useState<NonNullable<React.CSSProperties['cursor']>>('default');

  const hoveredElementRef = useRef<HTMLElement>(null);

  const [interaction, setInteraction] = useState<WorkspaceStatus>(WorkspaceStatus.idle);

  const getInteraction = useStableCallback((): WorkspaceStatus => {
    return interaction;
  });

  const status = useMemo<UIDesignToolStatus>(() => {
    switch (interaction) {
      case WorkspaceStatus.resizing:
      case WorkspaceStatus.resizingFromCenter:
      case WorkspaceStatus.resizingCorner:
      case WorkspaceStatus.resizingCornerFromCenter:
        return UIDesignToolStatus.resizing;
      case WorkspaceStatus.rotating:
        return UIDesignToolStatus.rotating;
      case WorkspaceStatus.selecting:
        return UIDesignToolStatus.selecting;
      case WorkspaceStatus.idle:
        return UIDesignToolStatus.idle;
      default:
        return UIDesignToolStatus.unknown;
    }
  }, [interaction]);

  const getStatus = useStableCallback((): UIDesignToolStatus => {
    return status;
  });

  const records = useMemo<Map<UIRecordKey, UIRecord>>(() => {
    return flatUIRecords([canvas]);
  }, [canvas]);

  const [selectedRecordKeys, setSelectedRecordKeys] = useState<UIRecordKey[]>([]);

  const selectedRecords = useMemo<Map<UIRecordKey, UIRecord>>(() => {
    const table = new Set(selectedRecordKeys);
    return new Map([...records].filter(([recordKey]) => table.has(recordKey)));
  }, [records, selectedRecordKeys]);

  const listeners = useMemo<Map<UIRecordKey, Set<(value: UIRecord) => void>>>(() => new Map(), []);

  const subscribe = useStableCallback((targetKey: UIRecordKey, callback: <T extends UIRecord>(value: T) => void): void => {
    if (!listeners.has(targetKey)) {
      listeners.set(targetKey, new Set());
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const callbacks = listeners.get(targetKey)!;
    callbacks.add(callback);
  });

  const unsubscribe = useStableCallback((targetKey: UIRecordKey, callback: <T extends UIRecord>(value: T) => void): void => {
    if (!listeners.has(targetKey)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const callbacks = listeners.get(targetKey)!;
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      // delete callbacks
      listeners.delete(targetKey);
    }
  });

  const get = useStableCallback(<T extends UIRecord>(targetKey: UIRecordKey | HTMLElement): T | undefined => {
    const recordKey = (targetKey instanceof HTMLElement ? targetKey.dataset[UIRecordElementDataset.key] : targetKey) ?? '';
    return records.get(recordKey) as T | undefined;
  });

  const getAll = useStableCallback((): DynamicRecord<UIRecord, UIRecordKey> => {
    return Object.fromEntries(records);
  });

  const getSelected = useStableCallback((): DynamicRecord<UIRecord, UIRecordKey> => {
    const result: DynamicRecord<UIRecord, UIRecordKey> = {};
    selectedRecordKeys.forEach((key: UIRecordKey) => {
      const record = get(key);
      if (record) {
        result[key] = record;
      }
    });
    return result;
  });

  const select = useStableCallback((recordKeys: UIRecordKey[]): void => {
    const missingRecordKeys: UIRecordKey[] = [];

    const newRecordPairs = recordKeys
      .map((key) => {
        const record = records.get(key);
        if (record == null) {
          missingRecordKeys.push(key);
          return;
        }
        return [record.key, record] as const;
      })
      .filter(nonNullable);
    const newRecordKeys = newRecordPairs.map(([key]) => key);

    if (missingRecordKeys.length > 0) {
      console.error(`UIRecord '${missingRecordKeys.join("', '")}' not found.`);
    }

    // 순서도 동일한지 확인해야 하므로 간단하게 stringify 결과를 비교
    const isEqual = JSON.stringify(selectedRecordKeys) === JSON.stringify(newRecordKeys);
    if (isEqual) {
      return;
    }

    setSelectedRecordKeys([...recordKeys]);
  });

  const set = useStableCallback(<T extends UIRecordData>(targetKey: UIRecordKey, value: Omit<Partial<T>, 'key'>): void => {
    const targetValue = records.get(targetKey);
    if (targetValue == null) {
      console.error(`UIRecord '${targetKey}' not found.`);
      return;
    }

    Object.assign(targetValue, value);
    listeners.get(targetKey)?.forEach((callback) => callback(targetValue));
  });

  const setRect = useStableCallback((targetKey: UIRecordKey, rect: UIRecordRect | UIRecordRectInit): void => {
    const targetValue = records.get(targetKey);
    if (targetValue == null) {
      console.error(`UIRecord '${targetKey}' not found.`);
      return;
    }

    if (!(targetValue instanceof Layer)) {
      console.error(`UIRecord '${targetKey}' is not a layer. setRect() only supports layer. (e.g. ShapeLayer, TextLayer)`);
      return;
    }

    if (!hasUIRecordParent(targetValue)) {
      console.error(`UIRecord '${targetKey}' has no parent.`);
      return;
    }

    const parentValue = targetValue.parent;
    const parentElement = query({ key: parentValue.key });
    const parentRect = parentElement != null ? UIRecordRect.fromElement(parentElement) : new UIRecordRect(0, 0, 0, 0, 0);

    /** @todo px 외 lengthType(unit) 지원 (변환 시 소수점 셋째 자리에서 반올림) */
    const newValue = cloneDeep(targetValue);
    newValue.x.length = rect.x - parentRect.x;
    newValue.y.length = rect.y - parentRect.y;
    newValue.width.length = rect.width;
    newValue.height.length = rect.height;
    newValue.rotate.length = rect.rotate;

    Object.assign(targetValue, newValue);
    listeners.get(targetKey)?.forEach((callback) => callback(targetValue));
  });

  /** @todo (react 외부로 분리 시) Function Overloading */
  const move = useStableCallback(
    (method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter', handleKey: UIRecordKey, destKey: UIRecordKey): void => {
      const handleValue = records.get(handleKey);
      if (handleValue == null) {
        console.error(`UIRecord '${handleKey}' not found.`);
        return;
      }

      const destValue = records.get(destKey);
      if (destValue == null) {
        console.error(`UIRecord '${destKey}' not found.`);
        return;
      }

      if (!hasUIRecordParent(handleValue)) {
        console.error(`UIRecord '${handleKey}' has no parent.`);
        return;
      }

      const startKey = handleValue.parent.key;
      const startValue = records.get(startKey);
      if (startValue == null) {
        console.error(`Parent ${startKey} of UIRecord '${handleKey}' not found.`);
        return;
      }

      if (!isUIRecordWithChildren(startValue)) {
        console.error(`children of UIRecord '${startKey}' is not array.`);
        return;
      }

      const handleIndex = startValue.children.findIndex((it) => it.key === handleKey);
      if (handleIndex < 0) {
        console.error(`children of UIRecord '${destKey}' has no UIRecord '${handleKey}'.`);
        return;
      }

      if (method === 'append' || method === 'prepend') {
        if (!isUIRecordWithChildren(destValue)) {
          console.error(`children of UIRecord '${destKey}' is not array.`);
          return;
        }

        startValue.children.splice(handleIndex, 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        destValue.children[method === 'prepend' ? 'unshift' : 'push'](handleValue as any);
        listeners.get(startKey)?.forEach((callback) => callback(startValue));
        listeners.get(destKey)?.forEach((callback) => callback(destValue));
      } else if (method === 'insertBefore' || method === 'insertAfter') {
        if (!hasUIRecordParent(destValue)) {
          console.error(`UIRecord '${destKey}' has no parent.`);
          return;
        }

        const destParentKey = destValue.parent.key;
        const destParentValue = records.get(destParentKey);
        if (destParentValue == null) {
          console.error(`Parent ${destParentKey} of UIRecord '${destKey}' not found.`);
          return;
        }

        if (!isUIRecordWithChildren(destParentValue)) {
          console.error(`children of UIRecord '${destParentKey}' is not array.`);
          return;
        }

        let targetIndex = destParentValue.children.findIndex((it) => it.key === destKey);
        if (targetIndex < 0) {
          console.error(`children of UIRecord '${destParentKey}' has no UIRecord '${destKey}'.`);
          return;
        }
        if (method === 'insertAfter') {
          targetIndex += 1;
        }

        startValue.children.splice(handleIndex, 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        destParentValue.children.splice(targetIndex, 0, handleValue as any);
        listeners.get(startKey)?.forEach((callback) => callback(startValue));
        listeners.get(destParentKey)?.forEach((callback) => callback(destParentValue));
      }
    },
  );

  const append = useStableCallback(<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T): void => {
    if (value.key != null && records.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
      return;
    }

    const parentValue = records.get(parentKey);
    if (parentValue == null) {
      console.error(`UIRecord '${parentKey}' not found.`);
      return;
    }

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }
    const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });

    records.set(targetValue.key, targetValue);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentValue.children.push(targetValue as any);
    listeners.get(parentKey)?.forEach((callback) => callback(parentValue));
  });

  const prepend = useStableCallback(<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T): void => {
    if (value.key != null && records.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
      return;
    }

    const parentValue = records.get(parentKey);
    if (parentValue == null) {
      console.error(`UIRecord '${parentKey}' not found.`);
      return;
    }

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }

    const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });

    records.set(targetValue.key, targetValue);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentValue.children.unshift(targetValue as any);
    listeners.get(parentKey)?.forEach((callback) => callback(parentValue));
  });

  const insert = useCallback(
    <T extends UIRecord | UIRecordData>(method: 'before' | 'after', siblingKey: UIRecordKey, value: T): void => {
      if (value.key != null && records.get(value.key)) {
        console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
        return;
      }

      const siblingValue = records.get(siblingKey);
      if (siblingValue == null) {
        console.error(`UIRecord '${siblingKey}' not found.`);
        return;
      }

      if (!hasUIRecordParent(siblingValue)) {
        console.error(`UIRecord '${siblingKey}' has no parent.`);
        return;
      }

      const parentKey = siblingValue.parent.key;
      const parentValue = records.get(parentKey ?? '');
      if (parentKey == null || parentValue == null) {
        console.error(`Parent ${parentKey} of UIRecord '${siblingKey}' not found.`);
        return;
      }

      if (!isUIRecordWithChildren(parentValue)) {
        console.error(`children of UIRecord '${parentKey}' is not array.`);
        return;
      }

      let targetIndex = parentValue.children.findIndex((it) => it.key === siblingKey);
      if (targetIndex < 0) {
        console.error(`children of UIRecord '${parentKey}' has no UIRecord '${siblingKey}'.`);
        return;
      }
      if (method === 'after') {
        targetIndex += 1;
      }

      const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });

      records.set(targetValue.key, targetValue);
      parentValue.children.splice(targetIndex, 0, targetValue);
      listeners.get(parentKey)?.forEach((callback) => callback(parentValue));
    },
    [listeners, records],
  );

  const insertBefore = useStableCallback(<T extends UIRecord | UIRecordData>(nextSiblingKey: UIRecordKey, value: T): void => {
    return insert('before', nextSiblingKey, value);
  });

  const insertAfter = useStableCallback(<T extends UIRecord | UIRecordData>(prevSiblingKey: UIRecordKey, value: T): void => {
    return insert('after', prevSiblingKey, value);
  });

  const remove = useStableCallback((targetKey: UIRecordKey): void => {
    const targetValue = records.get(targetKey);
    if (targetValue == null) {
      console.warn(`UIRecord '${targetKey}' not found.`);
      return;
    }

    if (!hasUIRecordParent(targetValue)) {
      records.delete(targetKey);
      return;
    }

    const parentKey = targetValue.parent.key;
    const parentValue = records.get(parentKey ?? '');
    if (parentValue == null) {
      console.error(`Parent ${parentKey} of UIRecord '${targetKey}' not found.`);
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
    listeners.get(parentKey)?.forEach((callback) => callback(parentValue));
  });

  const matches = useStableCallback((element: Element | null, filter: UIRecordElementFilter): boolean => {
    const selector = createUIRecordSelector(filter);
    return element?.matches(selector) ?? false;
  });

  const closest = useStableCallback(
    (target: UIRecordElementFilter, current: UIRecordElementFilter | Element | null): HTMLElement | null => {
      const from = current instanceof Element || current == null ? current : document.querySelector(createUIRecordSelector(current));
      const targetSelector = createUIRecordSelector(target);
      return from?.closest<HTMLElement>(targetSelector) ?? null;
    },
  );

  const query = useStableCallback(
    (target: UIRecordElementFilterItem, container: UIRecordElementFilter | Element | null = elementRef.current): HTMLElement | null => {
      const from =
        container instanceof Element || container == null ? container : document.querySelector(createUIRecordSelector(container));
      const targetSelector = createUIRecordSelector(target);
      return from?.querySelector<HTMLElement>(targetSelector) ?? null;
    },
  );

  const queryAll = useStableCallback(
    (target: UIRecordElementFilter, container: UIRecordElementFilter | Element | null = elementRef.current): NodeListOf<HTMLElement> => {
      const from =
        container instanceof Element || container == null ? container : document.querySelector(createUIRecordSelector(container));
      const targetSelector = createUIRecordSelector(target);
      return from?.querySelectorAll<HTMLElement>(targetSelector) ?? document.querySelectorAll(NULL_ELEMENT_SELECTOR);
    },
  );

  const fromPoint = useStableCallback((x: number, y: number): HTMLElement | null => {
    return closest([{ type: UIRecordType.artboard }, { type: UIRecordType.layer }], document.elementFromPoint(x, y)) ?? null;
  });

  const fromMouse = useStableCallback((): HTMLElement | null => hoveredElementRef.current);

  const onMouseMove = useEvent((event: MouseEvent) => {
    const { clientX, clientY } = event;
    const target = fromPoint(clientX, clientY);
    setRef(mousePointRef, { x: clientX, y: clientY });
    setRef(hoveredElementRef, target);
  });
  useEventListener(document, 'mousemove', onMouseMove, { capture: true });

  const onKeyDownUp = useEvent((event: KeyboardEvent) => {
    const { altKey: alt, ctrlKey: ctrl, metaKey: meta, shiftKey: shift } = event;
    setRef(modifierKeysRef, { alt, ctrl, meta, shift });
  });
  useEventListener(document, 'keydown', onKeyDownUp, { capture: true });
  useEventListener(document, 'keyup', onKeyDownUp, { capture: true });

  return {
    getBrowserMeta,

    cursor,
    setCursor,

    status,
    getStatus,

    interaction,
    getInteraction,
    setInteraction,

    records,
    selectedRecordKeys,
    selectedRecords,

    listeners,
    subscribe,
    unsubscribe,

    get,
    getAll,
    getSelected,

    select,

    set,
    setRect,
    move,
    append,
    prepend,
    insertBefore,
    insertAfter,
    remove,

    matches,
    closest,
    query,
    queryAll,
    fromPoint,
    fromMouse,
  };
}
