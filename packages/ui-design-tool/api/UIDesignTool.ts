import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import {
  UIDesignToolIDAttributeName,
  UIRecordElementDataset,
  UIRecordElementFilter,
  UIRecordElementFilterItem,
  UIRecordKey,
  UIRecordType,
} from '@/types/Identifier';
import { flatUIRecords, hasUIRecordParent, isUIRecordKey, isUIRecordWithChildren, toUIRecordInstance } from '@/utils/model';
import { createUIRecordSelector, NULL_ELEMENT_SELECTOR } from '@/utils/selector';
import { cloneDeep, exclude, mapValues, uuid } from '@pigyuma/utils';
import { Artboard } from './Artboard/model';
import { Canvas, CanvasData } from './Canvas/model';
import { Layer } from './Layer/model';
import { ShapeLayer } from './ShapeLayer/model';
import { TextLayer } from './TextLayer/model';
import { UIRecord, UIRecordData } from './UIRecord/model';

interface MouseMeta {
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
}

interface KeyboardMeta {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface BrowserMeta {
  readonly mouse: MouseMeta;
  readonly keyboard: KeyboardMeta;
}

/** @todo XState 도입 검토 (상태를 context에서 관리하고 constate로 분리하지 않아도 InteractionController 내에서 눈에 띄는 성능 저하는 없을 것으로 판단됨) */
export const UIDesignToolStatus = {
  unknown: 'unknown',
  idle: 'idle',
  /** Range selection */
  selecting: 'selecting',
  resizing: 'resizing',
  rotating: 'rotating',
} as const;
export type UIDesignToolStatus = keyof typeof UIDesignToolStatus;

export interface UIDesignToolOptions {
  strict?: boolean;
}

export const CANVAS_ELEMENT_FILTER: UIRecordElementFilter = { key: Canvas.key };

export const INITIAL_INSTANCE_ID = 'UNKNOWN';

export const INITIAL_BROWSER_META: BrowserMeta = {
  mouse: { clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 },
  keyboard: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false },
};

/**
 * @todo Design token 모델 및 관리 방식 설계
 * @todo History 관리 방식 설계
 * @todo Exception 발생 및 처리 기준 정의
 */
export class UIDesignTool {
  #strict: boolean;
  #id: string;

  readonly #browserMeta: BrowserMeta;
  readonly #listeners: {
    readonly item: Map<UIRecordKey, Set<(value: UIRecord | undefined) => void>>;
    readonly tree: Set<(values: UIRecord[]) => void>;
    readonly selection: Set<(values: UIRecord[]) => void>;
  };

  #mounted: boolean;
  #status: UIDesignToolStatus;

  readonly #items: Map<UIRecordKey, UIRecord>;
  #selectedItems: Set<Artboard | ShapeLayer | TextLayer>;

  #hoveredElement: HTMLElement | null;

  readonly #eventHandlers: {
    onMouseMove: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
  };

  constructor(options?: UIDesignToolOptions) {
    const { strict = true } = options ?? {};

    this.#strict = strict;
    this.#id = uuid.v4();

    this.#browserMeta = INITIAL_BROWSER_META;
    this.#listeners = {
      item: new Map(),
      tree: new Set(),
      selection: new Set(),
    };

    this.#mounted = false;
    this.#status = UIDesignToolStatus.idle;

    this.#items = flatUIRecords([new Canvas({ children: [] })]);
    this.#selectedItems = new Set();

    this.#hoveredElement = null;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const target = this.fromPoint(clientX, clientY);
      const rootBounds = document.querySelector(`[${UIDesignToolIDAttributeName}="${this.#id}"]`)?.getBoundingClientRect() ?? new DOMRect();
      this.#browserMeta.mouse.clientX = clientX;
      this.#browserMeta.mouse.clientY = clientY;
      this.#browserMeta.mouse.offsetX = clientX - rootBounds.x;
      this.#browserMeta.mouse.offsetY = clientY - rootBounds.y;
      this.#hoveredElement = target;
    };
    const onKeyDownUp = (event: KeyboardEvent) => {
      const { altKey, ctrlKey, metaKey, shiftKey } = event;
      this.#browserMeta.keyboard.altKey = altKey;
      this.#browserMeta.keyboard.ctrlKey = ctrlKey;
      this.#browserMeta.keyboard.metaKey = metaKey;
      this.#browserMeta.keyboard.shiftKey = shiftKey;
    };
    this.#eventHandlers = {
      onMouseMove,
      onKeyDown: onKeyDownUp,
      onKeyUp: onKeyDownUp,
    };
  }

  #setStatus(status: UIDesignToolStatus): void {
    if (this.#mounted) {
      this.#status = status;
    }
  }

  get #canvas(): Canvas {
    return this.#items.get(Canvas.key) as Canvas;
  }

  get status(): UIDesignToolStatus {
    return this.#status;
  }

  get tree(): Canvas {
    return this.#canvas;
  }

  get pairs(): Map<UIRecordKey, UIRecord> {
    return this.#items;
  }

  get selection(): Set<Artboard | ShapeLayer | TextLayer> {
    return this.#selectedItems;
  }

  mount() {
    if (this.#mounted) {
      const message = 'UIDesignTool already mounted.';

      if (this.#strict) {
        throw new Error(message);
      } else {
        console.error(message);
      }
    } else {
      this.#mounted = true;

      document.addEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
      document.addEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
      document.addEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });
    }

    // 외부에 노출할 필요가 없는 인터페이스는, 내부(UIDesignCanvas)에서만 사용하도록 `mount` 함수의 반환 값으로 은닉
    return {
      id: this.#id,
      getBrowserMeta: () => this.#browserMeta,
      setStatus: (status: UIDesignToolStatus) => this.#setStatus(status),
    };
  }

  unmount() {
    if (!this.#mounted) {
      console.warn('UIDesignTool is not mounted.');
    }

    document.removeEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
    document.removeEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
    document.removeEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });

    this.#mounted = false;
    this.#status = UIDesignToolStatus.idle;
    this.#browserMeta.mouse.clientX = INITIAL_BROWSER_META.mouse.clientX;
    this.#browserMeta.mouse.clientY = INITIAL_BROWSER_META.mouse.clientY;
    this.#browserMeta.keyboard.altKey = INITIAL_BROWSER_META.keyboard.altKey;
    this.#browserMeta.keyboard.ctrlKey = INITIAL_BROWSER_META.keyboard.ctrlKey;
    this.#browserMeta.keyboard.metaKey = INITIAL_BROWSER_META.keyboard.metaKey;
    this.#browserMeta.keyboard.shiftKey = INITIAL_BROWSER_META.keyboard.shiftKey;
    this.#hoveredElement = null;
  }

  subscribeItem(targetKey: UIRecordKey, callback: <T extends UIRecord>(value: T | undefined) => void): void {
    if (!this.#listeners.item.has(targetKey)) {
      this.#listeners.item.set(targetKey, new Set());
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const callbacks = this.#listeners.item.get(targetKey)!;
    callbacks.add(callback);
  }

  unsubscribeItem(targetKey: UIRecordKey, callback: <T extends UIRecord>(value: T | undefined) => void): void {
    if (!this.#listeners.item.has(targetKey)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const callbacks = this.#listeners.item.get(targetKey)!;
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      // delete callbacks
      this.#listeners.item.delete(targetKey);
    }
  }

  subscribeTree(callback: (values: UIRecord[]) => void): void {
    this.#listeners.tree.add(callback);
  }

  unsubscribeTree(callback: (values: UIRecord[]) => void): void {
    this.#listeners.tree.delete(callback);
  }

  subscribeSelection(callback: (values: UIRecord[]) => void): void {
    this.#listeners.selection.add(callback);
  }

  unsubscribeSelection(callback: (values: UIRecord[]) => void): void {
    this.#listeners.selection.delete(callback);
  }

  reset(data: CanvasData['children']): void {
    const newChildren = data.map((it) => toUIRecordInstance<ArrayElements<Canvas['children']>>(it));
    const canvas = this.#canvas;

    this.#items.clear();
    this.#selectedItems = new Set();

    while (canvas.children.length > 0) {
      canvas.children.pop();
    }
    newChildren.forEach((it) => {
      Object.assign(it, { parent: canvas });
      canvas.children.push(it);
    });

    const newItems = flatUIRecords([canvas]);

    newItems.forEach((it) => {
      this.#items.set(it.key, it);
    });

    this.#listeners.tree.forEach((callback) => callback([canvas]));
    newItems.forEach((it) => {
      this.#listeners.item.get(it.key)?.forEach((callback) => callback(it));
    });
    this.#listeners.selection.forEach((callback) => callback([]));
  }

  select(targetKeys: UIRecordKey[]): void {
    const missingRecordKeys: UIRecordKey[] = [];
    const invalidRecordKeys: UIRecordKey[] = [];

    const newRecordKeys: UIRecordKey[] = [];
    const newRecordValues: Array<Artboard | ShapeLayer | TextLayer> = [];

    targetKeys.forEach((key) => {
      const record = this.#items.get(key);
      if (record == null) {
        missingRecordKeys.push(key);
        return;
      }
      if (!Artboard.isModel(record) && !ShapeLayer.isModel(record) && !TextLayer.isModel(record)) {
        invalidRecordKeys.push(key);
        return;
      }
      newRecordKeys.push(record.key);
      newRecordValues.push(record);
    });

    if (missingRecordKeys.length > 0) {
      console.error(`UIRecord '${missingRecordKeys.join("', '")}' not found.`);
    }

    if (invalidRecordKeys.length > 0) {
      console.error(
        `UIRecord '${invalidRecordKeys.join("', '")}' is not selectable. Only Artboard, ShapeLayer, and TextLayer can be selected.`,
      );
    }

    // 순서도 동일한지 확인해야 하므로 간단하게 stringify 결과를 비교
    if (JSON.stringify([...this.#selectedItems].map(({ key }) => key)) === JSON.stringify(newRecordKeys)) {
      return;
    }

    this.#selectedItems = new Set(newRecordValues);
    this.#listeners.selection.forEach((callback) => callback(newRecordValues));
  }

  get<T extends UIRecord>(targetKey: UIRecordKey): T | undefined {
    return this.#items.get(targetKey) as T | undefined;
  }

  has(targetKey: UIRecordKey): boolean {
    return this.#items.has(targetKey);
  }

  isSelected(targetKey: UIRecordKey): boolean {
    return [...this.#selectedItems].find(({ key }) => key === targetKey) != null;
  }

  set<T extends UIRecordData>(targetKey: UIRecordKey, value: Omit<Partial<T>, 'key'>): void {
    const targetValue = this.#items.get(targetKey);
    if (targetValue == null) {
      console.error(`UIRecord '${targetKey}' not found.`);
      return;
    }

    Object.assign(targetValue, value);

    this.#listeners.tree.forEach((callback) => callback([targetValue]));
    this.#listeners.item.get(targetKey)?.forEach((callback) => callback(targetValue));
  }

  setRect(targetKey: UIRecordKey, rect: UIRecordRect | UIRecordRectInit): void {
    const targetValue = this.#items.get(targetKey);
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
    const parentElement = this.query({ key: parentValue.key });
    const parentRect = parentElement != null ? UIRecordRect.fromElement(parentElement) : new UIRecordRect(0, 0, 0, 0, 0);

    /** @todo px 외 lengthType(unit) 지원 (변환 시 소수점 셋째 자리에서 반올림) */
    const newValue = cloneDeep(targetValue);
    newValue.x.length = rect.x - parentRect.x;
    newValue.y.length = rect.y - parentRect.y;
    newValue.width.length = rect.width;
    newValue.height.length = rect.height;
    newValue.rotate.degrees = rect.rotate;

    Object.assign(targetValue, newValue);

    this.#listeners.tree.forEach((callback) => callback([targetValue]));
    this.#listeners.item.get(targetKey)?.forEach((callback) => callback(targetValue));
  }

  // 타입은 동일하지만, IDE에서 인자명을 보여주기 위해 Overloading 함
  move(method: 'append', handleKey: UIRecordKey, parentKey: UIRecordKey): void;
  move(method: 'prepend', handleKey: UIRecordKey, parentKey: UIRecordKey): void;
  move(method: 'insertBefore', handleKey: UIRecordKey, nextSiblingKey: UIRecordKey): void;
  move(method: 'insertAfter', handleKey: UIRecordKey, prevSiblingKey: UIRecordKey): void;
  move(method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter', handleKey: UIRecordKey, destKey: UIRecordKey): void;
  move(method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter', handleKey: UIRecordKey, destKey: UIRecordKey): void {
    const handleValue = this.#items.get(handleKey);
    if (handleValue == null) {
      console.error(`UIRecord '${handleKey}' not found.`);
      return;
    }

    const destValue = this.#items.get(destKey);
    if (destValue == null) {
      console.error(`UIRecord '${destKey}' not found.`);
      return;
    }

    if (!hasUIRecordParent(handleValue)) {
      console.error(`UIRecord '${handleKey}' has no parent.`);
      return;
    }

    const startKey = handleValue.parent.key;
    const startValue = this.#items.get(startKey);
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
      Object.assign(handleValue, { parent: destValue });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      destValue.children[method === 'prepend' ? 'unshift' : 'push'](handleValue as any);

      this.#listeners.tree.forEach((callback) => callback([startValue, destValue, handleValue]));
      this.#listeners.item.get(startKey)?.forEach((callback) => callback(startValue));
      this.#listeners.item.get(destKey)?.forEach((callback) => callback(destValue));
      this.#listeners.item.get(handleKey)?.forEach((callback) => callback(handleValue));
    } else if (method === 'insertBefore' || method === 'insertAfter') {
      if (!hasUIRecordParent(destValue)) {
        console.error(`UIRecord '${destKey}' has no parent.`);
        return;
      }

      const destParentKey = destValue.parent.key;
      const destParentValue = this.#items.get(destParentKey);
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
      Object.assign(handleValue, { parent: destParentValue });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      destParentValue.children.splice(targetIndex, 0, handleValue as any);

      this.#listeners.tree.forEach((callback) => callback([startValue, destParentValue, handleValue]));
      this.#listeners.item.get(startKey)?.forEach((callback) => callback(startValue));
      this.#listeners.item.get(destParentKey)?.forEach((callback) => callback(destParentValue));
      this.#listeners.item.get(handleKey)?.forEach((callback) => callback(handleValue));
    }
  }

  append<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T): void {
    if (value.key != null && this.#items.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
      return;
    }

    const parentValue = this.#items.get(parentKey);
    if (parentValue == null) {
      console.error(`UIRecord '${parentKey}' not found.`);
      return;
    }

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }
    const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });
    const targetKey = targetValue.key;

    this.#items.set(targetValue.key, targetValue);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentValue.children.push(targetValue as any);

    this.#listeners.tree.forEach((callback) => callback([parentValue]));
    this.#listeners.item.get(parentKey)?.forEach((callback) => callback(parentValue));
    this.#listeners.item.get(targetKey)?.forEach((callback) => callback(targetValue));
  }

  prepend<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T): void {
    if (value.key != null && this.#items.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
      return;
    }

    const parentValue = this.#items.get(parentKey);
    if (parentValue == null) {
      console.error(`UIRecord '${parentKey}' not found.`);
      return;
    }

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }

    const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });
    const targetKey = targetValue.key;

    this.#items.set(targetValue.key, targetValue);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentValue.children.unshift(targetValue as any);

    this.#listeners.tree.forEach((callback) => callback([parentValue]));
    this.#listeners.item.get(parentKey)?.forEach((callback) => callback(parentValue));
    this.#listeners.item.get(targetKey)?.forEach((callback) => callback(targetValue));
  }

  #insert<T extends UIRecord | UIRecordData>(method: 'before' | 'after', siblingKey: UIRecordKey, value: T): void {
    if (value.key != null && this.#items.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
      return;
    }

    const siblingValue = this.#items.get(siblingKey);
    if (siblingValue == null) {
      console.error(`UIRecord '${siblingKey}' not found.`);
      return;
    }

    if (!hasUIRecordParent(siblingValue)) {
      console.error(`UIRecord '${siblingKey}' has no parent.`);
      return;
    }

    const parentKey = siblingValue.parent.key;
    const parentValue = this.#items.get(parentKey ?? '');
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
    const targetKey = targetValue.key;

    this.#items.set(targetValue.key, targetValue);
    parentValue.children.splice(targetIndex, 0, targetValue);

    this.#listeners.tree.forEach((callback) => callback([parentValue]));
    this.#listeners.item.get(parentKey)?.forEach((callback) => callback(parentValue));
    this.#listeners.item.get(targetKey)?.forEach((callback) => callback(targetValue));
  }

  insertBefore<T extends UIRecord | UIRecordData>(nextSiblingKey: UIRecordKey, value: T): void {
    return this.#insert('before', nextSiblingKey, value);
  }

  insertAfter<T extends UIRecord | UIRecordData>(prevSiblingKey: UIRecordKey, value: T): void {
    return this.#insert('after', prevSiblingKey, value);
  }

  remove(targetKey: UIRecordKey): void {
    const targetValue = this.#items.get(targetKey);
    if (targetValue == null) {
      console.warn(`UIRecord '${targetKey}' not found.`);
      return;
    }

    const canHaveParent = hasUIRecordParent(targetValue);
    const parentKey = canHaveParent ? targetValue.parent.key : undefined;
    const parentValue = this.#items.get(parentKey ?? '');
    const hasParent = isUIRecordKey(parentKey) && parentValue != null;

    if (canHaveParent) {
      (() => {
        if (!hasParent) {
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

        parentValue.children.splice(targetIndex, 1);
      })();
    }

    const deleteTree = (record: UIRecord, stack: UIRecord[] = []): UIRecord[] => {
      stack.push(record);
      this.#items.delete(record.key);
      if (isUIRecordWithChildren(record)) {
        record.children.forEach((it) => deleteTree(it, stack));
      }
      return stack;
    };

    const deletedItems = deleteTree(targetValue);
    const newSelectedItems = exclude([...this.#selectedItems], deletedItems);
    // 순서도 동일한지 확인해야 하므로 간단하게 stringify 결과를 비교
    const isSelectionChanged =
      JSON.stringify([...this.#selectedItems].map(({ key }) => key)) === JSON.stringify(newSelectedItems.map(({ key }) => key));
    if (isSelectionChanged) {
      this.#selectedItems = new Set(newSelectedItems);
    }

    if (hasParent) {
      this.#listeners.tree.forEach((callback) => callback([parentValue]));
      this.#listeners.item.get(parentKey)?.forEach((callback) => callback(parentValue));
    } else {
      this.#listeners.tree.forEach((callback) => callback([]));
    }
    this.#listeners.item.get(targetKey)?.forEach((callback) => callback(undefined));
    if (isSelectionChanged) {
      this.#listeners.selection.forEach((callback) => callback(newSelectedItems));
    }
  }

  dataset(element: HTMLElement): { key: string | undefined; type: string | undefined; layerType: string | undefined } {
    return mapValues(UIRecordElementDataset, (datasetKey) => element.dataset[datasetKey]);
  }

  matches(element: Element | null, filter: UIRecordElementFilter): boolean {
    const selector = createUIRecordSelector(filter);
    return element?.matches(selector) ?? false;
  }

  closest(target: UIRecordElementFilter, current: UIRecordElementFilter | Element | null): HTMLElement | null {
    const from = current instanceof Element || current == null ? current : document.querySelector(createUIRecordSelector(current));
    const targetSelector = createUIRecordSelector(target);
    return from?.closest<HTMLElement>(targetSelector) ?? null;
  }

  query(target: UIRecordElementFilterItem, container: UIRecordElementFilter | Element | null = CANVAS_ELEMENT_FILTER): HTMLElement | null {
    const from =
      container instanceof Element ? container : document.querySelector(createUIRecordSelector(container ?? CANVAS_ELEMENT_FILTER));
    const targetSelector = createUIRecordSelector(target);
    return from?.querySelector<HTMLElement>(targetSelector) ?? null;
  }

  queryAll(
    target: UIRecordElementFilter,
    container: UIRecordElementFilter | Element | null = CANVAS_ELEMENT_FILTER,
  ): NodeListOf<HTMLElement> {
    const from =
      container instanceof Element ? container : document.querySelector(createUIRecordSelector(container ?? CANVAS_ELEMENT_FILTER));
    const targetSelector = createUIRecordSelector(target);
    return from?.querySelectorAll<HTMLElement>(targetSelector) ?? document.querySelectorAll(NULL_ELEMENT_SELECTOR);
  }

  fromPoint(x: number, y: number): HTMLElement | null {
    return this.closest([{ type: UIRecordType.artboard }, { type: UIRecordType.layer }], document.elementFromPoint(x, y)) ?? null;
  }

  fromMouse(): HTMLElement | null {
    return this.#hoveredElement;
  }
}
