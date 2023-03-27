import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import {
  UIDesignToolElementDataAttributeName,
  UIRecordElementDataset,
  UIRecordElementFilter,
  UIRecordElementFilterItem,
  UIRecordKey,
  UIRecordType,
} from '@/types/Identifier';
import { flatUIRecords, hasUIRecordParent, isUIRecordKey, isUIRecordWithChildren, toUIRecordInstance } from '@/utils/model';
import { createUIRecordSelector, NULL_ELEMENT_SELECTOR } from '@/utils/selector';
import { fixNumberValue } from '@/utils/value';
import { exclude, mapValues, merge, toDegrees360, uuid } from '@pigyuma/utils';
import { Artboard, ArtboardData } from './Artboard/model';
import { Canvas, CanvasData } from './Canvas/model';
import { ShapeLayer, ShapeLayerData } from './ShapeLayer/model';
import { TextLayer, TextLayerData } from './TextLayer/model';
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

export type UIRecordChanges<T extends UIRecordData> = Omit<DeepPartial<T>, 'key' | 'parent' | 'children'>;

export const UIDesignToolMode = {
  /** Select & Move */
  select: 'select',
  artboard: 'artboard',
  /** Rectangle, ... */
  shape: 'shape',
  text: 'text',
  hand: 'hand',
} as const;
export type UIDesignToolMode = keyof typeof UIDesignToolMode;

/** * @see 플로우차트 (XState를 사용하진 않음) {@link https://stately.ai/viz/6a265ced-0d2c-4412-9088-f511f6105e2e} */
export const UIDesignToolStatus = {
  unknown: 'unknown',
  idle: 'idle',
  /** Range selection */
  select: 'select',
  draw: 'draw',
  move: 'move',
  resize: 'resize',
  rotate: 'rotate',
} as const;
export type UIDesignToolStatus = keyof typeof UIDesignToolStatus;

export const UIDesignToolInteractionType = {
  idle: 'idle',
  selection: 'selection',
  drawing: 'drawing',
  transform: 'transform',
} as const;
export type UIDesignToolInteractionType = keyof typeof UIDesignToolInteractionType;

export const UIDesignToolTransformMethod = {
  unable: 'unable',
  move: 'move',
  resize: 'resize',
  rotate: 'rotate',
} as const;
export type UIDesignToolTransformMethod = keyof typeof UIDesignToolTransformMethod;

export interface UIDesignToolOptions {
  strict?: boolean;
  id?: string;
}

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
  readonly #strict: boolean;
  readonly #id: string;

  readonly #browserMeta: BrowserMeta;
  readonly #listeners: {
    readonly mode: Set<(mode: UIDesignToolMode) => void>;
    readonly status: Set<(status: UIDesignToolStatus) => void>;
    readonly tree: Set<(tree: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void>;
    readonly selection: Set<(selected: UIRecordKey[]) => void>;
  };

  #mounted: boolean;
  #mode: UIDesignToolMode;
  #interactionType: UIDesignToolInteractionType;
  #transformMethod: UIDesignToolTransformMethod;

  readonly #items: Map<UIRecordKey, UIRecord>;
  readonly #selectedKeys: Set<UIRecordKey>;

  #hoveredElement: HTMLElement | null;

  readonly #eventHandlers: {
    onMouseMove: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
  };

  constructor(options?: UIDesignToolOptions) {
    const { strict = true, id = uuid.v4() } = options ?? {};

    this.#strict = strict;
    this.#id = id;

    this.#browserMeta = INITIAL_BROWSER_META;
    this.#listeners = {
      mode: new Set(),
      status: new Set(),
      tree: new Set(),
      selection: new Set(),
    };

    this.#mounted = false;
    this.#mode = UIDesignToolMode.select;
    this.#interactionType = UIDesignToolInteractionType.idle;
    this.#transformMethod = UIDesignToolTransformMethod.unable;

    this.#items = flatUIRecords([new Canvas({ children: [] })]);
    this.#selectedKeys = new Set();

    this.#hoveredElement = null;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const target = this.fromPoint(clientX, clientY);
      const rootBounds = document.querySelector(this.#rootElementSelector)?.getBoundingClientRect() ?? new DOMRect();
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

  #setStatus(statusMeta: { interactionType: UIDesignToolInteractionType; transformMethod: UIDesignToolTransformMethod }): void {
    if (this.#mounted) {
      const prevStatus = this.status;
      this.#interactionType = statusMeta.interactionType;
      this.#transformMethod = statusMeta.transformMethod;
      if (prevStatus !== this.status) {
        this.#listeners.status.forEach((callback) => callback(this.status));
      }
    }
  }

  get #canvas(): Canvas {
    return this.#items.get(Canvas.key) as Canvas;
  }

  get #rootElementSelector(): string {
    return `[${UIDesignToolElementDataAttributeName.id}="${this.#id}"]`;
  }

  get mode(): UIDesignToolMode {
    return this.#mode;
  }

  get status(): UIDesignToolStatus {
    if (this.#interactionType === UIDesignToolInteractionType.idle) {
      return UIDesignToolStatus.idle;
    }
    if (this.#interactionType === UIDesignToolInteractionType.selection) {
      return UIDesignToolStatus.select;
    }
    if (this.#interactionType === UIDesignToolInteractionType.drawing) {
      return UIDesignToolStatus.draw;
    }
    if (this.#interactionType === UIDesignToolInteractionType.transform) {
      if (this.#transformMethod === UIDesignToolTransformMethod.move) {
        return UIDesignToolStatus.move;
      }
      if (this.#transformMethod === UIDesignToolTransformMethod.resize) {
        return UIDesignToolStatus.resize;
      }
      if (this.#transformMethod === UIDesignToolTransformMethod.rotate) {
        return UIDesignToolStatus.rotate;
      }
    }
    return UIDesignToolStatus.unknown;
  }

  get tree(): Canvas {
    return this.#canvas;
  }

  get pairs(): Map<UIRecordKey, UIRecord> {
    return this.#items;
  }

  get selected(): Set<UIRecordKey> {
    return this.#selectedKeys;
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
      setStatus: (status: { interactionType: UIDesignToolInteractionType; transformMethod: UIDesignToolTransformMethod }) =>
        this.#setStatus(status),
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
    this.#mode = UIDesignToolMode.select;
    this.#interactionType = UIDesignToolInteractionType.idle;
    this.#transformMethod = UIDesignToolTransformMethod.unable;
    this.#browserMeta.mouse.clientX = INITIAL_BROWSER_META.mouse.clientX;
    this.#browserMeta.mouse.clientY = INITIAL_BROWSER_META.mouse.clientY;
    this.#browserMeta.keyboard.altKey = INITIAL_BROWSER_META.keyboard.altKey;
    this.#browserMeta.keyboard.ctrlKey = INITIAL_BROWSER_META.keyboard.ctrlKey;
    this.#browserMeta.keyboard.metaKey = INITIAL_BROWSER_META.keyboard.metaKey;
    this.#browserMeta.keyboard.shiftKey = INITIAL_BROWSER_META.keyboard.shiftKey;
    this.#hoveredElement = null;
  }

  subscribeMode(callback: (mode: UIDesignToolMode) => void): void {
    this.#listeners.mode.add(callback);
  }

  unsubscribeMode(callback: (mode: UIDesignToolMode) => void): void {
    this.#listeners.mode.delete(callback);
  }

  subscribeStatus(callback: (status: UIDesignToolStatus) => void): void {
    this.#listeners.status.add(callback);
  }

  unsubscribeStatus(callback: (status: UIDesignToolStatus) => void): void {
    this.#listeners.status.delete(callback);
  }

  subscribeTree(callback: (all: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void): void {
    this.#listeners.tree.add(callback);
  }

  unsubscribeTree(callback: (all: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void): void {
    this.#listeners.tree.delete(callback);
  }

  subscribeSelection(callback: (selected: UIRecordKey[]) => void): void {
    this.#listeners.selection.add(callback);
  }

  unsubscribeSelection(callback: (selected: UIRecordKey[]) => void): void {
    this.#listeners.selection.delete(callback);
  }

  toggleMode(mode: UIDesignToolMode): void {
    const prevMode = this.mode;
    this.#mode = mode;
    if (prevMode !== this.mode) {
      this.#listeners.mode.forEach((callback) => callback(this.mode));
    }
  }

  reset(data: CanvasData['children']): void {
    const newChildren = data.map((it) => toUIRecordInstance<ArrayElements<Canvas['children']>>(it));
    const canvas = this.#canvas;

    const deletedKeys = [...this.#items.keys()];

    this.#items.clear();
    this.#selectedKeys.clear();

    while (canvas.children.length > 0) {
      canvas.children.pop();
    }
    newChildren.forEach((it) => {
      merge(it, { parent: canvas });
      canvas.children.push(it);
    });

    const newItems = flatUIRecords([canvas]);

    newItems.forEach((it) => {
      this.#items.set(it.key, it);
    });

    this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], [...newItems.values()], deletedKeys));
    this.#listeners.selection.forEach((callback) => callback([]));
  }

  select(targetKeys: UIRecordKey[]): void {
    const missingRecordKeys: UIRecordKey[] = [];
    const invalidRecordKeys: UIRecordKey[] = [];

    const newSelectedKeys: UIRecordKey[] = [];

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
      newSelectedKeys.push(record.key);
    });

    if (missingRecordKeys.length > 0) {
      console.error(`UIRecord '${missingRecordKeys.join("', '")}' not found.`);
    }

    if (invalidRecordKeys.length > 0) {
      console.error(
        `UIRecord '${invalidRecordKeys.join("', '")}' is not selectable. Only Artboard, ShapeLayer, and TextLayer can be selected.`,
      );
    }

    // 순서도 동일한지 확인해야 하므로 stringify 결과를 비교
    const isSelectionChanged = JSON.stringify([...this.#selectedKeys]) !== JSON.stringify(newSelectedKeys);

    if (isSelectionChanged) {
      this.#selectedKeys.clear();
      newSelectedKeys.forEach((key) => this.#selectedKeys.add(key));
      this.#listeners.selection.forEach((callback) => callback(newSelectedKeys));
    }
  }

  get<T extends UIRecord>(targetKey: UIRecordKey): T | undefined {
    return this.#items.get(targetKey) as T | undefined;
  }

  has(targetKey: UIRecordKey): boolean {
    return this.#items.has(targetKey);
  }

  isSelected(targetKey: UIRecordKey): boolean {
    return this.#selectedKeys.has(targetKey);
  }

  set<T extends UIRecordData>(targetKey: UIRecordKey, value: UIRecordChanges<T> | ((prev: T) => UIRecordChanges<T>)): void {
    const targetValue = this.#items.get(targetKey);
    if (targetValue == null) {
      console.error(`UIRecord '${targetKey}' not found.`);
      return;
    }

    const newTargetValue = typeof value === 'function' ? value(targetValue as unknown as T) : value;
    if (targetValue instanceof Artboard) {
      const v = newTargetValue as UIRecordChanges<ArtboardData>;
      if (v.x) {
        v.x = fixNumberValue(v.x);
      }
      if (v.y) {
        v.y = fixNumberValue(v.y);
      }
      if (v.width) {
        v.width = fixNumberValue(Math.max(v.width, 1));
      }
      if (v.height) {
        v.height = fixNumberValue(Math.max(v.height, 1));
      }
    } else if (targetValue instanceof ShapeLayer) {
      const { x, y, width, height, rotate, stroke } = newTargetValue as UIRecordChanges<ShapeLayerData>;
      const strokeWidth = stroke?.width;
      if (x?.length != null) {
        x.length = fixNumberValue(x.length);
      }
      if (y?.length != null) {
        y.length = fixNumberValue(y.length);
      }
      if (width?.length != null) {
        width.length = fixNumberValue(Math.max(width.length, 1));
      }
      if (height?.length != null) {
        height.length = fixNumberValue(Math.max(height.length, 1));
      }
      if (rotate?.degrees != null) {
        rotate.degrees = fixNumberValue(toDegrees360(rotate.degrees));
      }
      if (strokeWidth?.top != null) {
        strokeWidth.top = fixNumberValue(Math.max(strokeWidth.top, 0));
      }
      if (strokeWidth?.right != null) {
        strokeWidth.right = fixNumberValue(Math.max(strokeWidth.right, 0));
      }
      if (strokeWidth?.bottom != null) {
        strokeWidth.bottom = fixNumberValue(Math.max(strokeWidth.bottom, 0));
      }
      if (strokeWidth?.left != null) {
        strokeWidth.left = fixNumberValue(Math.max(strokeWidth.left, 0));
      }
    }
    if (targetValue instanceof TextLayer) {
      const { rotate } = newTargetValue as UIRecordChanges<TextLayerData>;
      if (rotate?.degrees != null) {
        rotate.degrees = fixNumberValue(toDegrees360(rotate.degrees));
      }
    }

    merge(targetValue, newTargetValue);

    this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], [targetValue], []));
  }

  setRect(targetKey: UIRecordKey, rect: UIRecordRect | UIRecordRectInit): void {
    const targetValue = this.#items.get(targetKey);
    if (targetValue == null) {
      console.error(`UIRecord '${targetKey}' not found.`);
      return;
    }

    const isArtboard = targetValue instanceof Artboard;
    const isShapeLayer = targetValue instanceof ShapeLayer;
    const isTextLayer = targetValue instanceof TextLayer;

    if (!isArtboard && !isShapeLayer && !isTextLayer) {
      console.error(`UIRecord '${targetKey}' is not a layer. setRect() only supports Artboard and Layer.`);
      return;
    }

    if (!hasUIRecordParent(targetValue)) {
      console.error(`UIRecord '${targetKey}' has no parent.`);
      return;
    }

    const parentValue = targetValue.parent;
    const parentElement = this.query({ key: parentValue.key });
    const parentRect = parentElement != null ? UIRecordRect.fromElement(parentElement) : new UIRecordRect(0, 0, 0, 0, 0);

    const x = rect.x - parentRect.x;
    const y = rect.y - parentRect.y;
    const width = rect.width;
    const height = rect.height;
    const rotate = rect.rotate;

    /** @todo px 외 lengthType(unit) 지원 */
    const newTargetValue: UIRecordChanges<UIRecordData> = {};
    if (isArtboard) {
      const v = newTargetValue as UIRecordChanges<ArtboardData>;
      v.x = x;
      v.y = y;
      v.width = width;
      v.height = height;
    } else if (isShapeLayer) {
      const v = newTargetValue as UIRecordChanges<ShapeLayerData>;
      v.x = { length: x };
      v.y = { length: y };
      v.width = { length: width };
      v.height = { length: height };
      v.rotate = { degrees: rotate };
    } else if (isTextLayer) {
      const v = newTargetValue as UIRecordChanges<TextLayerData>;
      v.rotate = { degrees: rotate };
    }

    this.set(targetKey, newTargetValue);
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
      merge(handleValue, { parent: destValue });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      destValue.children[method === 'prepend' ? 'unshift' : 'push'](handleValue as any);

      this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], [startValue, destValue, handleValue], []));
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
      merge(handleValue, { parent: destParentValue });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      destParentValue.children.splice(targetIndex, 0, handleValue as any);

      this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], [startValue, destParentValue, handleValue], []));
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

    this.#items.set(targetValue.key, targetValue);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentValue.children.push(targetValue as any);

    this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], [parentValue, targetValue], []));
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

    this.#items.set(targetValue.key, targetValue);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentValue.children.unshift(targetValue as any);

    this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], [parentValue, targetValue], []));
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

    this.#items.set(targetValue.key, targetValue);
    parentValue.children.splice(targetIndex, 0, targetValue);

    this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], [parentValue, targetValue], []));
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

    const deletedKeys = deleteTree(targetValue).map((it) => it.key);
    const newSelectedKeys = exclude([...this.#selectedKeys], deletedKeys);
    // 순서도 동일한지 확인해야 하므로 stringify 결과를 비교
    const isSelectionChanged = JSON.stringify([...this.#selectedKeys]) !== JSON.stringify(newSelectedKeys);

    if (isSelectionChanged) {
      this.#selectedKeys.clear();
      newSelectedKeys.forEach((key) => this.#selectedKeys.add(key));
    }

    this.#listeners.tree.forEach((callback) => callback([...this.#items.values()], hasParent ? [parentValue] : [], deletedKeys));
    if (isSelectionChanged) {
      this.#listeners.selection.forEach((callback) => callback(newSelectedKeys));
    }
  }

  dataset(element: Element | null): { key: string | undefined; type: string | undefined; layerType: string | undefined } {
    return mapValues(UIRecordElementDataset, (datasetKey) => (element as Partial<HTMLElement | SVGElement> | null)?.dataset?.[datasetKey]);
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

  query(target: UIRecordElementFilterItem, container?: UIRecordElementFilter | Element | null): HTMLElement | null {
    const from =
      container instanceof Element
        ? container
        : document.querySelector(container ? createUIRecordSelector(container) : this.#rootElementSelector);
    const targetSelector = createUIRecordSelector(target);
    return from?.querySelector<HTMLElement>(targetSelector) ?? null;
  }

  queryAll(target: UIRecordElementFilter, container?: UIRecordElementFilter | Element | null): NodeListOf<HTMLElement> {
    const from =
      container instanceof Element
        ? container
        : document.querySelector(container ? createUIRecordSelector(container) : this.#rootElementSelector);
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
