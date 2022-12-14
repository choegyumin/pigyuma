import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { UIRecordRect, UIRecordRectInit } from '@/types/Shape';
import { flatUIRecords } from '@/utils/convert';
import { hasUIRecordParent, isUIRecordWithChildren, toUIRecordInstance } from '@/utils/model';
import { setRef, useEvent, useEventListener, useStableCallback } from '@pigyuma/react-utils';
import { cloneDeep, kebabCase } from '@pigyuma/utils';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Canvas } from '../Canvas/Canvas.model';
import { Layer } from '../Layer/Layer.model';
import { UIRecord, UIRecordData } from '../UIRecord/UIRecord.model';
import { WorkspaceInteraction, WorkspaceStatus } from './types';
import { UIRecordElementFilter, UIRecordElementFilterItem } from './Workspace.context';

const createSelector = (filter: UIRecordElementFilter) => {
  const make = (filterItem: UIRecordElementFilterItem) =>
    Object.entries(filterItem)
      .filter(([, values]) => values != null)
      .map(([prop, values]) =>
        Array.isArray(values)
          ? values.map((value) => `[data-ui-record-${kebabCase(prop)}="${value}"]`).join('')
          : `[data-ui-record-${kebabCase(prop)}="${values}"]`,
      )
      .join('');
  return Array.isArray(filter) ? filter.map((filterItem) => make(filterItem)).join(',') : make(filter);
};

/**
 * @todo Exception 발생 및 처리 기준 정의
 * @todo apps/web 개발 시 Workspace 상위 컴포넌트에서의 API 사용 방식 변경 (records를 Workspace 상위에서 상태 관리하고 주입하지만, 조작은 API를 통해 이루어져야 함)
 * @todo History 관리 방식 설계
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

  const [interaction, setInteraction] = useState<WorkspaceInteraction>(WorkspaceInteraction.idle);

  const getInteraction = useStableCallback((): WorkspaceInteraction => {
    return interaction;
  });

  const status = useMemo<WorkspaceStatus>(() => {
    switch (interaction) {
      case WorkspaceInteraction.resizing:
      case WorkspaceInteraction.resizingFromCenter:
      case WorkspaceInteraction.resizingCorner:
      case WorkspaceInteraction.resizingCornerFromCenter:
        return WorkspaceStatus.resizing;
      case WorkspaceInteraction.rotating:
        return WorkspaceStatus.rotating;
      case WorkspaceInteraction.selecting:
        return WorkspaceStatus.selecting;
      case WorkspaceInteraction.idle:
        return WorkspaceStatus.idle;
      default:
        return WorkspaceStatus.unknown;
    }
  }, [interaction]);

  const getStatus = useStableCallback((): WorkspaceStatus => {
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

  const listeners = useMemo<Record<UIRecordKey, Set<(value: UIRecord) => void>>>(() => ({}), []);

  const subscribe = useStableCallback((targetKey: UIRecordKey, callback: <T extends UIRecord>(value: T) => void): void => {
    if (listeners[targetKey] == null) {
      listeners[targetKey] = new Set();
    }
    listeners[targetKey].add(callback);
  });

  const unsubscribe = useStableCallback((targetKey: UIRecordKey, callback: <T extends UIRecord>(value: T) => void): void => {
    if (!listeners[targetKey]?.has(callback)) {
      return;
    }
    listeners[targetKey].delete(callback);
    if (listeners[targetKey].size === 0) {
      delete listeners[targetKey];
    }
  });

  const get = useStableCallback(<T extends UIRecord>(targetKey: UIRecordKey | HTMLElement): T | undefined => {
    const recordKey = (targetKey instanceof HTMLElement ? targetKey.dataset.uiRecordKey : targetKey) ?? '';
    return records.get(recordKey) as T | undefined;
  });

  const getAll = useStableCallback((): Record<UIRecordKey, UIRecord> => {
    return Object.fromEntries(records);
  });

  const getSelected = useStableCallback((): Record<UIRecordKey, UIRecord> => {
    const result: Record<UIRecordKey, UIRecord> = {};
    selectedRecordKeys.forEach((key: UIRecordKey) => {
      const record = get(key);
      if (record) {
        result[key] = record;
      }
    });
    return result;
  });

  const select = useStableCallback((recordKeys: UIRecordKey[]): void => {
    if (JSON.stringify(selectedRecordKeys) === JSON.stringify(recordKeys)) {
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
    listeners[targetKey]?.forEach((it) => it(targetValue));
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
    listeners[targetKey]?.forEach((it) => it(targetValue));
  });

  /** @todo move API 구현 */
  const move = useStableCallback(
    (method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter', handleKey: UIRecordKey, destKey: UIRecordKey): void => {
      console.log('@todo WorkspaceContext.move()', { method, handleKey, destKey });
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
    listeners[parentKey]?.forEach((it) => it(parentValue));
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
    listeners[parentKey]?.forEach((it) => it(parentValue));
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
      const parentValue = records.get(parentKey ?? '') || records.get(parentKey ?? '');
      if (parentKey == null || parentValue == null) {
        console.error(`UIRecord '${parentKey}' not found.`);
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
      listeners[parentKey]?.forEach((it) => it(parentValue));
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
    listeners[parentKey]?.forEach((it) => it(parentValue));
  });

  const matches = useStableCallback((target: Element | null, filter: UIRecordElementFilter): boolean => {
    const selector = createSelector(filter);
    return target?.matches(selector) ?? false;
  });

  const closest = useStableCallback((target: Element | null, filter: UIRecordElementFilter): HTMLElement | null => {
    const selector = createSelector(filter);
    return target?.closest<HTMLElement>(selector) ?? null;
  });

  const query = useStableCallback(
    (filter: UIRecordElementFilterItem, container: Element | null = elementRef.current): HTMLElement | null => {
      const selector = createSelector(filter);
      return container?.querySelector<HTMLElement>(selector) ?? null;
    },
  );

  const queryAll = useStableCallback(
    (filter: UIRecordElementFilter, container: Element | null = elementRef.current): NodeListOf<HTMLElement> => {
      const selector = createSelector(filter);
      return container?.querySelectorAll<HTMLElement>(selector) ?? document.querySelectorAll('');
    },
  );

  const fromPoint = useStableCallback((x: number, y: number): HTMLElement | null => {
    return closest(document.elementFromPoint(x, y), [{ type: UIRecordType.artboard }, { type: UIRecordType.layer }]) ?? null;
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
