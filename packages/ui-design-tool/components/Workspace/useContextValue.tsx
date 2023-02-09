import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { Canvas } from '@/ui-models/Canvas/model';
import { Layer } from '@/ui-models/Layer/model';
import { UIRecord, UIRecordData } from '@/ui-models/UIRecord/model';
import { flatUIRecords, hasUIRecordParent, isUIRecordWithChildren, toUIRecordInstance } from '@/utils/model';
import { setRef, useEvent, useEventListener, useStableCallback } from '@pigyuma/react-utils';
import { cloneDeep, kebabCase } from '@pigyuma/utils';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
 * @todo Design token 모델 및 관리 방식 설계
 * @todo History 관리 방식 설계
 * @todo Exception 발생 및 처리 기준 정의
 * @todo (apps/web 개발 진행 시) UIDesignToolAPI 제공 방식 변경
 *     - 명령형 API 외 Hooks API 제공 (상태 관리가 필요할 때 `get()` 메서드 대신 `useUIRecord()` 와 같은 훅을 사용해야 함)
 *     - Workspace 내부의 UIDesignToolAPIProvider 삭제 (더이상 API를 얻기 위해 ref를 사용하지 않음)
 *     - Workspace 상위(앱 루트)에서 인스턴스(`new UIDesignTool({ records })`)를 생성해 UIDesignToolProvider로 전달하는 초기화 과정을 거침 (앱 전역에서 명령형 API를, 그리고 React Query 처럼 providing 해 react 앱 내부에서 Hooks API를 사용할 수 있게 함)
 * @todo (UIDesignToolAPI 제공 방식 변경 시) 테스트 코드 작성
 *     - context values가 react 외부로 분리됨에 따라, `cursor`, `interaction`, `status` 등 의도적으로 재조정을 유발하는 상태는 어떻게 관리할 것인지 고려해야 함
 * @todo 명령형 API로 데이터를 조작했을 때, listener callback이 호출되어 컴포넌트의 상태가 업데이트 완료되기 전, 다시 명령형 API로 가져온 데이터의 무결성을 react의 수명 주기에 맞추어 보장해야 하는지 검토 (react 내부 상태는 deep cloning되어 참조가 끊어졌기 때문에 문제가 아닐 수도 있음. 명령은 명령대로, 상태는 상태대로,)
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

  /** @todo XState 도입 검토 (상태를 context에서 관리하고 constate로 분리하지 않아도 InteractionController 내에서 눈에 띄는 성능 저하는 없을 것으로 판단됨) */
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
        listeners[startKey]?.forEach((it) => it(startValue));
        listeners[destKey]?.forEach((it) => it(destValue));
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
        listeners[startKey]?.forEach((it) => it(startValue));
        listeners[destParentKey]?.forEach((it) => it(destParentValue));
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
