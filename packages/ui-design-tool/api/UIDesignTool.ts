import { BrowserMeta } from '@/types/Browser';
import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import {
  UIDesignToolElementDataAttributeName,
  UIRecordElementDataset,
  UIRecordElementFilter,
  UIRecordElementFilterItem,
  UIRecordKey,
  UIRecordType,
} from '@/types/Identifier';
import {
  UIDesignToolInteractionType,
  UIDesignToolMode,
  UIDesignToolStatus,
  UIDesignToolStatusMeta,
  UIDesignToolTransformMethod,
} from '@/types/Status';
import { flatUIRecords, hasUIRecordParent, isUIRecordKey, isUIRecordWithChildren, toUIRecordInstance } from '@/utils/model';
import { createUIRecordSelector, NULL_ELEMENT_SELECTOR } from '@/utils/selector';
import { getInteractionType, getTransformMethod } from '@/utils/status';
import { cloneDeep, exclude, mapValues, nonUndefined, pickBy, uuid } from '@pigyuma/utils';
import { Artboard, ArtboardData } from './Artboard/model';
import { Canvas, CanvasData } from './Canvas/model';
import { Layer, LayerData } from './Layer/model';
import { ShapeLayer, ShapeLayerData } from './ShapeLayer/model';
import { TextLayer, TextLayerData } from './TextLayer/model';
import { UIRecord, UIRecordChanges, UIRecordData, UIRecordValueChanges } from './UIRecord/model';

const assignChanges = <T extends UIRecord, C extends UIRecordChanges<T> = UIRecordChanges<T>>(targetValue: T, changes: C): T => {
  return Object.assign(targetValue, pickBy(changes, nonUndefined));
};

export interface UIDesignToolOptions {
  strict?: boolean;
  id?: string;
}

export interface UIDesignToolEditOptions {
  saveDraft?: boolean;
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
    readonly status: Set<(status: UIDesignToolStatus, meta: UIDesignToolStatusMeta) => void>;
    readonly tree: Set<(tree: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void>;
    readonly selection: Set<(selected: UIRecordKey[]) => void>;
  };

  #mounted: boolean;
  #mode: UIDesignToolMode;
  #status: UIDesignToolStatus;

  readonly #items: Map<UIRecordKey, UIRecord>;
  readonly #drafts: Array<[UIRecordKey, UIRecord | UIRecordChanges<UIRecord>]>;
  readonly #selectedKeys: Set<UIRecordKey>;

  #hoveredElement: HTMLElement | null;

  readonly #eventHandlers: {
    onMouseMove: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
  };

  constructor(options: UIDesignToolOptions = {}) {
    const { strict = true, id = uuid.v4() } = options;

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
    this.#status = UIDesignToolStatus.idle;

    this.#items = flatUIRecords([new Canvas({ children: [] })]);
    this.#drafts = [];
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

  #create<T extends UIRecord>(targetKey: UIRecordKey, instance: T, options: UIDesignToolEditOptions = {}): T {
    const { saveDraft = false } = options;

    if (saveDraft) {
      this.#drafts.push([targetKey, instance]);
    } else {
      this.#items.set(targetKey, instance);
    }

    return instance;
  }

  #assign<T extends UIRecord, C extends UIRecordChanges<T> = UIRecordChanges<T>>(
    targetKey: UIRecordKey,
    changes: C,
    options: UIDesignToolEditOptions = {},
  ): T {
    const { saveDraft = false } = options;

    const targetValue = this.get<T>(targetKey);
    if (targetValue == null) {
      throw new Error(`UIRecord '${targetKey}' not found.`);
    }

    if (saveDraft) {
      this.#drafts.push([targetKey, changes]);
    } else {
      assignChanges(targetValue, changes);
    }

    return targetValue;
  }

  #remove(targetKey: UIRecordKey) {
    const newDrafts = this.#drafts.filter(([key]) => key !== targetKey);
    this.#drafts.length = 0;
    this.#drafts.push(...newDrafts);
    this.#items.delete(targetKey);
  }

  #makeChanges<T extends UIRecordData, C extends UIRecordChanges<T> = UIRecordChanges<T>>(
    targetKey: UIRecordKey,
    changes: C | ((prev: T) => C),
  ): C {
    const targetValue = this.get(targetKey);
    if (targetValue == null) {
      throw new Error(`UIRecord '${targetKey}' not found.`);
    }

    const isArtboard = targetValue instanceof Artboard;
    const isShapeLayer = targetValue instanceof ShapeLayer;
    const isTextLayer = targetValue instanceof TextLayer;
    const isLayer = targetValue instanceof Layer;
    const isCanvas = targetValue instanceof Canvas;

    const newChanges = { ...(typeof changes === 'function' ? changes(targetValue as unknown as T) : changes) };

    if (isArtboard) {
      return Artboard.makeChanges(newChanges as UIRecordChanges<ArtboardData>, targetValue) as C;
    } else if (isShapeLayer) {
      return ShapeLayer.makeChanges(newChanges as UIRecordChanges<ShapeLayerData>, targetValue) as C;
    } else if (isTextLayer) {
      return TextLayer.makeChanges(newChanges as UIRecordChanges<TextLayerData>, targetValue) as C;
    } else if (isLayer) {
      return Layer.makeChanges(newChanges as UIRecordChanges<LayerData>, targetValue) as C;
    } else if (isCanvas) {
      return Canvas.makeChanges(newChanges as UIRecordChanges<CanvasData>, targetValue) as C;
    }

    return UIRecord.makeChanges(newChanges as UIRecordChanges<UIRecord>, targetValue) as C;
  }

  #makeChangesFromRect<T extends UIRecordData, C extends UIRecordChanges<T> = UIRecordChanges<T>>(
    targetKey: UIRecordKey,
    rect: UIRecordRect | UIRecordRectInit,
  ): C {
    const targetValue = this.get(targetKey);
    if (targetValue == null) {
      throw new Error(`UIRecord '${targetKey}' not found.`);
    }

    const isArtboard = targetValue instanceof Artboard;
    const isShapeLayer = targetValue instanceof ShapeLayer;
    const isTextLayer = targetValue instanceof TextLayer;

    if (!isArtboard && !isShapeLayer && !isTextLayer) {
      throw new Error(`UIRecord '${targetKey}' is not a layer. setRect() only supports Artboard and Layer.`);
    }

    if (!hasUIRecordParent(targetValue)) {
      throw new Error(`UIRecord '${targetKey}' has no parent.`);
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
    const newChanges = {} as C;
    if (isArtboard) {
      const v = newChanges as UIRecordChanges<ArtboardData>;
      v.x = x;
      v.y = y;
      v.width = width;
      v.height = height;
    } else if (isShapeLayer) {
      const v = newChanges as UIRecordChanges<ShapeLayerData>;
      v.x = { length: x };
      v.y = { length: y };
      v.width = { length: width };
      v.height = { length: height };
      v.rotate = { degrees: rotate };
    } else if (isTextLayer) {
      const v = newChanges as UIRecordChanges<TextLayerData>;
      v.rotate = { degrees: rotate };
    }

    return this.#makeChanges<T, C>(targetKey, newChanges);
  }

  #setStatus(status: UIDesignToolStatus): void {
    if (!this.#mounted) {
      return console.error('UIDesignTool is not mounted.');
    }
    const prevStatus = this.status;
    this.#status = status;
    if (prevStatus !== this.status) {
      this.#listeners.status.forEach((callback) =>
        callback(this.status, {
          interactionType: this.interactionType,
          transformMethod: this.transformMethod,
        }),
      );
    }
  }

  get #canvas(): Canvas {
    return this.get(Canvas.key) as Canvas;
  }

  get #rootElementSelector(): string {
    return `[${UIDesignToolElementDataAttributeName.id}="${this.#id}"]`;
  }

  get mode(): UIDesignToolMode {
    return this.#mode;
  }

  get status(): UIDesignToolStatus {
    return this.#status;
  }

  get interactionType(): UIDesignToolInteractionType {
    return getInteractionType(this.status);
  }

  get transformMethod(): UIDesignToolTransformMethod {
    return getTransformMethod(this.status);
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
    this.#mode = UIDesignToolMode.select;
    this.#status = UIDesignToolStatus.idle;
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

  subscribeStatus(callback: (status: UIDesignToolStatus, meta: UIDesignToolStatusMeta) => void): void {
    this.#listeners.status.add(callback);
  }

  unsubscribeStatus(callback: (status: UIDesignToolStatus, meta: UIDesignToolStatusMeta) => void): void {
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
    if (this.status !== UIDesignToolStatus.idle) {
      return console.error('mode can only be changed when status is idle.');
    }
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
    this.#drafts.length = 0;

    while (canvas.children.length > 0) {
      canvas.children.pop();
    }
    newChildren.forEach((it) => {
      assignChanges(it, { parent: canvas });
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
      const record = this.previewDrafts().get(key) ?? this.get(key);
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
    return this.pairs.get(targetKey) as T | undefined;
  }

  has(targetKey: UIRecordKey): boolean {
    return this.pairs.has(targetKey);
  }

  isSelected(targetKey: UIRecordKey): boolean {
    return this.selected.has(targetKey);
  }

  set<T extends UIRecord>(
    targetKey: UIRecordKey,
    value: UIRecordValueChanges<T> | ((prev: T) => UIRecordValueChanges<T>),
    options?: UIDesignToolEditOptions,
  ): void {
    try {
      const changes = this.#makeChanges(targetKey, value as UIRecordChanges<T>);
      const targetValue = this.#assign(targetKey, changes, options);
      this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], [targetValue], []));
    } catch (error) {
      console.error(error);
    }
  }

  setRect(targetKey: UIRecordKey, rect: UIRecordRect | UIRecordRectInit, options?: UIDesignToolEditOptions): void {
    try {
      const changes = this.#makeChangesFromRect(targetKey, rect);
      const targetValue = this.#assign(targetKey, changes, options);
      this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], [targetValue], []));
    } catch (error) {
      console.error(error);
    }
  }

  // 타입은 동일하지만, IDE에서 인자명을 보여주기 위해 Overloading 함
  move(method: 'append', handleKey: UIRecordKey, parentKey: UIRecordKey, options?: UIDesignToolEditOptions): void;
  move(method: 'prepend', handleKey: UIRecordKey, parentKey: UIRecordKey, options?: UIDesignToolEditOptions): void;
  move(method: 'insertBefore', handleKey: UIRecordKey, nextSiblingKey: UIRecordKey, options?: UIDesignToolEditOptions): void;
  move(method: 'insertAfter', handleKey: UIRecordKey, prevSiblingKey: UIRecordKey, options?: UIDesignToolEditOptions): void;
  move(
    method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter',
    handleKey: UIRecordKey,
    destKey: UIRecordKey,
    options?: UIDesignToolEditOptions,
  ): void;
  move(
    method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter',
    handleKey: UIRecordKey,
    destKey: UIRecordKey,
    options?: UIDesignToolEditOptions,
  ): void {
    const handleValue = this.get(handleKey);
    if (handleValue == null) {
      console.error(`UIRecord '${handleKey}' not found.`);
      return;
    }

    const destValue = this.get(destKey);
    if (destValue == null) {
      console.error(`UIRecord '${destKey}' not found.`);
      return;
    }

    if (!hasUIRecordParent<Artboard | ShapeLayer | TextLayer>(handleValue)) {
      console.error(`UIRecord '${handleKey}' has no parent.`);
      return;
    }

    const startKey = handleValue.parent.key;
    const startValue = this.get(startKey);
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

      const newStartChildren = [...startValue.children];
      newStartChildren.splice(handleIndex, 1);

      const newDestChildren = [...destValue.children];
      newDestChildren[method === 'prepend' ? 'unshift' : 'push'](handleValue);

      this.#assign<typeof handleValue>(handleKey, { parent: destValue as typeof handleValue['parent'] }, options);
      this.#assign<typeof startValue>(startKey, { children: newStartChildren }, options);
      this.#assign<typeof destValue>(destKey, { children: newDestChildren }, options);

      this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], [startValue, destValue, handleValue], []));
    } else if (method === 'insertBefore' || method === 'insertAfter') {
      if (!hasUIRecordParent(destValue)) {
        console.error(`UIRecord '${destKey}' has no parent.`);
        return;
      }

      const destParentKey = destValue.parent.key;
      const destParentValue = this.get(destParentKey);
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

      const newStartChildren = [...startValue.children];
      newStartChildren.splice(handleIndex, 1);

      const newDestParentChildren = [...destParentValue.children];
      newDestParentChildren.splice(targetIndex, 0, handleValue);

      this.#assign<typeof handleValue>(handleKey, { parent: destParentValue as typeof handleValue['parent'] }, options);
      this.#assign<typeof startValue>(startKey, { children: newStartChildren }, options);
      this.#assign<typeof destParentValue>(destParentKey, { children: newDestParentChildren }, options);

      this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], [startValue, destParentValue, handleValue], []));
    }
  }

  #join<T extends UIRecord | UIRecordData>(
    method: 'prepend' | 'append',
    parentKey: UIRecordKey,
    value: T,
    options?: UIDesignToolEditOptions,
  ): void {
    if (value.key != null && this.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
      return;
    }

    const parentValue = this.get(parentKey);
    if (parentValue == null) {
      console.error(`UIRecord '${parentKey}' not found.`);
      return;
    }

    if (!isUIRecordWithChildren(parentValue)) {
      console.error(`children of UIRecord '${parentKey}' is not array.`);
      return;
    }

    const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });

    const newParentChildren = [...parentValue.children];
    newParentChildren[method === 'prepend' ? 'unshift' : 'push'](targetValue);

    this.#create(targetValue.key, targetValue, options);
    this.#assign<typeof parentValue>(parentValue.key, { children: newParentChildren }, options);

    this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], [parentValue, targetValue], []));
  }

  append<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T, options?: UIDesignToolEditOptions): void {
    return this.#join('append', parentKey, value, options);
  }

  prepend<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T, options?: UIDesignToolEditOptions): void {
    return this.#join('prepend', parentKey, value, options);
  }

  #insert<T extends UIRecord | UIRecordData>(
    method: 'before' | 'after',
    siblingKey: UIRecordKey,
    value: T,
    options?: UIDesignToolEditOptions,
  ): void {
    if (value.key != null && this.get(value.key)) {
      console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
      return;
    }

    const siblingValue = this.get(siblingKey);
    if (siblingValue == null) {
      console.error(`UIRecord '${siblingKey}' not found.`);
      return;
    }

    if (!hasUIRecordParent(siblingValue)) {
      console.error(`UIRecord '${siblingKey}' has no parent.`);
      return;
    }

    const parentKey = siblingValue.parent.key;
    const parentValue = this.get(parentKey ?? '');
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

    const newParentChildren = [...parentValue.children];
    newParentChildren.splice(targetIndex, 0, targetValue);

    this.#create(targetValue.key, targetValue, options);
    this.#assign<typeof parentValue>(parentValue.key, { children: newParentChildren }, options);

    this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], [parentValue, targetValue], []));
  }

  insertBefore<T extends UIRecord | UIRecordData>(nextSiblingKey: UIRecordKey, value: T, options?: UIDesignToolEditOptions): void {
    return this.#insert('before', nextSiblingKey, value, options);
  }

  insertAfter<T extends UIRecord | UIRecordData>(prevSiblingKey: UIRecordKey, value: T, options?: UIDesignToolEditOptions): void {
    return this.#insert('after', prevSiblingKey, value, options);
  }

  remove(targetKey: UIRecordKey): void {
    const targetValue = this.get(targetKey);
    if (targetValue == null) {
      console.warn(`UIRecord '${targetKey}' not found.`);
      return;
    }

    const canHaveParent = hasUIRecordParent(targetValue);
    const parentKey = canHaveParent ? targetValue.parent.key : undefined;
    const parentValue = this.get(parentKey ?? '');
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

        const newChildren = [...parentValue.children];
        newChildren.splice(targetIndex, 1);
        this.#assign<typeof parentValue>(parentKey, { children: newChildren });
      })();
    }

    const deleteTree = (record: UIRecord, stack: UIRecord[] = []): UIRecord[] => {
      stack.push(record);
      this.#remove(record.key);
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

    this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], hasParent ? [parentValue] : [], deletedKeys));
    if (isSelectionChanged) {
      this.#listeners.selection.forEach((callback) => callback(newSelectedKeys));
    }
  }

  previewDrafts(): typeof this.pairs {
    const draftItems = new Map<UIRecordKey, UIRecord>();

    const missingRecordKeys: UIRecordKey[] = [];

    const drafts = this.#drafts.filter(([targetKey, changesOrInstance]) => {
      const isInstance = changesOrInstance instanceof UIRecord;
      const hasOriginal = this.get(targetKey) != null;
      const passed = isInstance || hasOriginal;
      if (!passed) {
        missingRecordKeys.push(targetKey);
      }
      return passed;
    });

    if (missingRecordKeys.length > 0) {
      console.error(`UIRecord '${missingRecordKeys.join("', '")}' not found.`);
    }

    drafts.forEach(([targetKey, changesOrInstance]) => {
      const instance = (() => {
        if (changesOrInstance instanceof UIRecord) {
          return changesOrInstance;
        }
        const instance = draftItems.get(targetKey) ?? cloneDeep(this.get(targetKey)!);
        assignChanges(instance, changesOrInstance);
        return instance;
      })();

      // 순서 조정
      draftItems.delete(targetKey);
      draftItems.set(targetKey, instance);
    });

    return draftItems;
  }

  flushDrafts(): void {
    const hasDrafts = this.#drafts.length > 0;
    if (!hasDrafts) {
      return;
    }

    const newValues: UIRecord[] = [];

    this.#drafts.forEach(([targetKey, changesOrInstance]) => {
      try {
        const isInstance = changesOrInstance instanceof UIRecord;
        if (isInstance) {
          this.#create(targetKey, changesOrInstance, { saveDraft: false });
          newValues.push(changesOrInstance);
        } else {
          this.#assign(targetKey, changesOrInstance, { saveDraft: false });
          newValues.push(this.get(targetKey)!);
        }
      } catch (error) {
        console.error(error);
      }
    });

    this.#drafts.length = 0;

    this.#listeners.tree.forEach((callback) => callback([...this.pairs.values()], newValues, []));
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
