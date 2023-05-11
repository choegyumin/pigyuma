import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { UIRecordKey } from '@/types/Identifier';
import { UIDesignToolInteractionType, UIDesignToolMode, UIDesignToolStatus, UIDesignToolTransformMethod } from '@/types/Status';
import { flatUIRecords, hasUIRecordParent, isUIRecordKey, isUIRecordWithChildren, toUIRecordInstance } from '@/utils/model';
import { getInteractionType, getTransformMethod } from '@/utils/status';
import { exclude, makeSymbolicFields, nonNullable, nonUndefined, pickBy } from '@pigyuma/utils';
import { Artboard, ArtboardData } from './Artboard/model';
import { Canvas, CanvasData } from './Canvas/model';
import { Protected as ExtendsProtected, ElementSelector, ElementSelectorConfig } from './ElementSelector';
import { Layer, LayerData } from './Layer/model';
import { ShapeLayer, ShapeLayerData } from './ShapeLayer/model';
import { TextLayer, TextLayerData } from './TextLayer/model';
import { UIRecord, UIRecordData } from './UIRecord/model';

const assignChanges = <T extends UIRecord, C extends DeepPartial<T> = DeepPartial<T>>(record: T, changes: C): T => {
  return Object.assign(record, pickBy(changes, nonUndefined));
};

export interface UIRecordCreateOptions {
  saveDraft?: boolean;
}

export interface ModelStoreConfig extends ElementSelectorConfig {}

export const Protected = makeSymbolicFields(
  {
    setStatus: 'setStatus',
  },
  ExtendsProtected,
);

/** @todo 테스트 코드 고도화 */
export class ModelStore extends ElementSelector {
  #mode: UIDesignToolMode;
  #status: UIDesignToolStatus;

  readonly #items: Map<UIRecordKey, UIRecord>;
  readonly #draftKeys: Set<UIRecordKey>;
  readonly #selectedKeys: Set<UIRecordKey>;

  constructor(config: ModelStoreConfig = {}) {
    const { strict, id } = config;

    super({ strict, id });

    this.#mode = UIDesignToolMode.select;
    this.#status = UIDesignToolStatus.idle;

    this.#items = flatUIRecords([new Canvas({ children: [] })]);
    this.#draftKeys = new Set();
    this.#selectedKeys = new Set();
  }

  #create<T extends UIRecord>(targetKey: UIRecordKey, instance: T, options: UIRecordCreateOptions = {}): T {
    const { saveDraft = false } = options;

    this.#items.set(targetKey, instance);
    if (saveDraft) {
      this.#draftKeys.add(targetKey);
    }

    return instance;
  }

  #assign<T extends UIRecord, C extends DeepPartial<T> = DeepPartial<T>>(targetKey: UIRecordKey, changes: C) {
    const instance = this.get<UIRecord>(targetKey);
    if (instance == null) {
      throw new Error(`UIRecord '${targetKey}' not found.`);
    }

    assignChanges(instance, changes);

    return instance;
  }

  #remove(targetKey: UIRecordKey) {
    this.#items.delete(targetKey);
    this.#draftKeys.delete(targetKey);
  }

  #makeChanges<T extends UIRecordData, C extends DeepPartial<T> = DeepPartial<T>>(
    targetKey: UIRecordKey,
    changes: C | ((prev: T) => C),
  ): C {
    const targetValue = this.get(targetKey);
    if (targetValue == null) {
      throw new Error(`UIRecord '${targetKey}' not found.`);
    }

    const targetIsArtboard = targetValue instanceof Artboard;
    const targetIsShapeLayer = targetValue instanceof ShapeLayer;
    const targetIsTextLayer = targetValue instanceof TextLayer;
    const targetIsLayer = targetValue instanceof Layer;
    const targetIsCanvas = targetValue instanceof Canvas;

    const newChanges = { ...(typeof changes === 'function' ? changes(targetValue as unknown as T) : changes) };

    // prettier-ignore
    {
      if (targetIsArtboard) { return Artboard.makeChanges(newChanges as DeepPartial<ArtboardData>, targetValue) as C; }
      if (targetIsShapeLayer) { return ShapeLayer.makeChanges(newChanges as DeepPartial<ShapeLayerData>, targetValue) as C; }
      if (targetIsTextLayer) { return TextLayer.makeChanges(newChanges as DeepPartial<TextLayerData>, targetValue) as C; }
      if (targetIsLayer) { return Layer.makeChanges(newChanges as DeepPartial<LayerData>, targetValue) as C; }
      if (targetIsCanvas) { return Canvas.makeChanges(newChanges as DeepPartial<CanvasData>, targetValue) as C; }
      return UIRecord.makeChanges(newChanges as DeepPartial<UIRecord>, targetValue) as C;
    }
  }

  #makeChangesFromRect<T extends UIRecordData, C extends DeepPartial<T> = DeepPartial<T>>(
    targetKey: UIRecordKey,
    rect: UIRecordRect | UIRecordRectInit,
  ): C {
    const targetValue = this.get(targetKey);
    if (targetValue == null) {
      throw new Error(`UIRecord '${targetKey}' not found.`);
    }

    const targetIsArtboard = targetValue instanceof Artboard;
    const targetIsShapeLayer = targetValue instanceof ShapeLayer;
    const targetIsTextLayer = targetValue instanceof TextLayer;

    if (!targetIsArtboard && !targetIsShapeLayer && !targetIsTextLayer) {
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
    if (targetIsArtboard) {
      Object.assign(newChanges, {
        x,
        y,
        width,
        height,
      });
    } else if (targetIsShapeLayer) {
      Object.assign(newChanges, {
        x: { length: x },
        y: { length: y },
        width: { length: width },
        height: { length: height },
        rotate: { degrees: rotate },
      });
    } else if (targetIsTextLayer) {
      Object.assign(newChanges, {
        rotate: { degrees: rotate },
      });
    }

    return this.#makeChanges<T, C>(targetKey, newChanges);
  }

  protected [Protected.setStatus](status: UIDesignToolStatus): void {
    const prevStatus = this.status;
    this.#status = status;
    if (prevStatus !== this.status) {
      this[Protected.dispatchStatusChanges](this.status, {
        interactionType: this.interactionType,
        transformMethod: this.transformMethod,
      });
    }
  }

  get #canvas(): Canvas {
    return this.get(Canvas.key) as Canvas;
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

  get drafts(): Set<UIRecordKey> {
    return this.#draftKeys;
  }

  get selected(): Set<UIRecordKey> {
    return this.#selectedKeys;
  }

  toggleMode(mode: UIDesignToolMode): void {
    if (this.status !== UIDesignToolStatus.idle) {
      console.warn('Changing modes when not idle status can cause bugs');
    }
    const prevMode = this.mode;
    this.#mode = mode;
    if (prevMode !== this.mode) {
      this[Protected.dispatchModeChanges](this.mode);
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
      assignChanges(it, { parent: canvas });
      canvas.children.push(it);
    });

    const newItems = flatUIRecords([canvas]);

    newItems.forEach((it) => {
      this.#items.set(it.key, it);
    });

    this[Protected.dispatchTreeChanges]([...this.#items.values()], [...newItems.values()], deletedKeys);
    this[Protected.dispatchSelectionChanges]([]);
  }

  select(targetKeys: UIRecordKey[]): void {
    const missingRecordKeys: UIRecordKey[] = [];
    const invalidRecordKeys: UIRecordKey[] = [];

    const newSelectedKeys: UIRecordKey[] = [];

    targetKeys.forEach((key) => {
      const record = this.get(key);
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
    const selectionChanged = JSON.stringify([...this.#selectedKeys]) !== JSON.stringify(newSelectedKeys);

    if (selectionChanged) {
      this.#selectedKeys.clear();
      newSelectedKeys.forEach((key) => this.#selectedKeys.add(key));
      this[Protected.dispatchSelectionChanges](newSelectedKeys);
    }
  }

  get<T extends UIRecord>(targetKey: UIRecordKey): T | undefined {
    return this.pairs.get(targetKey) as T | undefined;
  }

  has(targetKey: UIRecordKey): boolean {
    return this.pairs.has(targetKey);
  }

  isDraft(targetKey: UIRecordKey): boolean {
    return this.drafts.has(targetKey);
  }

  isSelected(targetKey: UIRecordKey): boolean {
    return this.selected.has(targetKey);
  }

  set<T extends UIRecordData>(targetKey: UIRecordKey, value: DeepPartial<T> | ((prev: T) => DeepPartial<T>)): void {
    try {
      const changes = this.#makeChanges(targetKey, value);
      const targetValue = this.#assign(targetKey, changes as DeepPartial<UIRecord>);
      this[Protected.dispatchTreeChanges]([...this.pairs.values()], [targetValue], []);
    } catch (error) {
      console.error(error);
    }
  }

  setRect(targetKey: UIRecordKey, rect: UIRecordRect | UIRecordRectInit): void {
    try {
      const changes = this.#makeChangesFromRect(targetKey, rect);
      const targetValue = this.#assign(targetKey, changes as DeepPartial<UIRecord>);
      this[Protected.dispatchTreeChanges]([...this.pairs.values()], [targetValue], []);
    } catch (error) {
      console.error(error);
    }
  }

  // 타입은 동일하지만, IDE에서 인자명을 보여주기 위해 Overloading 함
  move(method: 'append', handleKey: UIRecordKey, parentKey: UIRecordKey): void;
  move(method: 'prepend', handleKey: UIRecordKey, parentKey: UIRecordKey): void;
  move(method: 'insertBefore', handleKey: UIRecordKey, nextSiblingKey: UIRecordKey): void;
  move(method: 'insertAfter', handleKey: UIRecordKey, prevSiblingKey: UIRecordKey): void;
  move(method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter', handleKey: UIRecordKey, destKey: UIRecordKey): void;
  move(method: 'append' | 'prepend' | 'insertBefore' | 'insertAfter', handleKey: UIRecordKey, destKey: UIRecordKey): void {
    const handleValue = this.get(handleKey);
    if (handleValue == null) {
      return console.error(`UIRecord '${handleKey}' not found.`);
    }

    const destValue = this.get(destKey);
    if (destValue == null) {
      return console.error(`UIRecord '${destKey}' not found.`);
    }

    if (!hasUIRecordParent<Artboard | ShapeLayer | TextLayer>(handleValue)) {
      return console.error(`UIRecord '${handleKey}' has no parent.`);
    }

    const startKey = handleValue.parent.key;
    const startValue = this.get(startKey);
    if (startValue == null) {
      return console.error(`Parent ${startKey} of UIRecord '${handleKey}' not found.`);
    }

    if (!isUIRecordWithChildren(startValue)) {
      return console.error(`children of UIRecord '${startKey}' is not array.`);
    }

    const handleIndex = startValue.children.findIndex((it) => it.key === handleKey);
    if (handleIndex < 0) {
      return console.error(`children of UIRecord '${destKey}' has no UIRecord '${handleKey}'.`);
    }

    if (method === 'append' || method === 'prepend') {
      if (!isUIRecordWithChildren(destValue)) {
        return console.error(`children of UIRecord '${destKey}' is not array.`);
      }

      const newStartChildren = [...startValue.children];
      newStartChildren.splice(handleIndex, 1);

      const newDestChildren = [...destValue.children];
      newDestChildren[method === 'prepend' ? 'unshift' : 'push'](handleValue);

      this.#assign<typeof handleValue>(handleKey, { parent: destValue as typeof handleValue['parent'] });
      this.#assign<typeof startValue>(startKey, { children: newStartChildren });
      this.#assign<typeof destValue>(destKey, { children: newDestChildren });

      this[Protected.dispatchTreeChanges]([...this.pairs.values()], [startValue, destValue, handleValue], []);
    } else if (method === 'insertBefore' || method === 'insertAfter') {
      if (!hasUIRecordParent(destValue)) {
        return console.error(`UIRecord '${destKey}' has no parent.`);
      }

      const destParentKey = destValue.parent.key;
      const destParentValue = this.get(destParentKey);
      if (destParentValue == null) {
        return console.error(`Parent ${destParentKey} of UIRecord '${destKey}' not found.`);
      }

      if (!isUIRecordWithChildren(destParentValue)) {
        return console.error(`children of UIRecord '${destParentKey}' is not array.`);
      }

      let targetIndex = destParentValue.children.findIndex((it) => it.key === destKey);
      if (targetIndex < 0) {
        return console.error(`children of UIRecord '${destParentKey}' has no UIRecord '${destKey}'.`);
      }
      if (method === 'insertAfter') {
        targetIndex += 1;
      }

      const newStartChildren = [...startValue.children];
      newStartChildren.splice(handleIndex, 1);

      const newDestParentChildren = [...destParentValue.children];
      newDestParentChildren.splice(targetIndex, 0, handleValue);

      this.#assign<typeof handleValue>(handleKey, { parent: destParentValue as typeof handleValue['parent'] });
      this.#assign<typeof startValue>(startKey, { children: newStartChildren });
      this.#assign<typeof destParentValue>(destParentKey, { children: newDestParentChildren });

      this[Protected.dispatchTreeChanges]([...this.pairs.values()], [startValue, destParentValue, handleValue], []);
    }
  }

  #join<T extends UIRecord | UIRecordData>(
    method: 'prepend' | 'append',
    parentKey: UIRecordKey,
    value: T,
    options?: UIRecordCreateOptions,
  ): void {
    if (value.key != null && this.get(value.key)) {
      return console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
    }

    const parentValue = this.get(parentKey);
    if (parentValue == null) {
      return console.error(`UIRecord '${parentKey}' not found.`);
    }

    if (!isUIRecordWithChildren(parentValue)) {
      return console.error(`children of UIRecord '${parentKey}' is not array.`);
    }

    const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });

    const newParentChildren = [...parentValue.children];
    newParentChildren[method === 'prepend' ? 'unshift' : 'push'](targetValue);

    this.#create(targetValue.key, targetValue, options);
    this.#assign<typeof parentValue>(parentValue.key, { children: newParentChildren });

    this[Protected.dispatchTreeChanges]([...this.pairs.values()], [parentValue, targetValue], []);
  }

  append<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T, options?: UIRecordCreateOptions): void {
    return this.#join('append', parentKey, value, options);
  }

  prepend<T extends UIRecord | UIRecordData>(parentKey: UIRecordKey, value: T, options?: UIRecordCreateOptions): void {
    return this.#join('prepend', parentKey, value, options);
  }

  #insert<T extends UIRecord | UIRecordData>(
    method: 'before' | 'after',
    siblingKey: UIRecordKey,
    value: T,
    options?: UIRecordCreateOptions,
  ): void {
    if (value.key != null && this.get(value.key)) {
      return console.error(`UIRecord '${value.key}' already exists. Did you try to call \`move()\`?`);
    }

    const siblingValue = this.get(siblingKey);
    if (siblingValue == null) {
      return console.error(`UIRecord '${siblingKey}' not found.`);
    }

    if (!hasUIRecordParent(siblingValue)) {
      return console.error(`UIRecord '${siblingKey}' has no parent.`);
    }

    const parentKey = siblingValue.parent.key;
    const parentValue = this.get(parentKey ?? '');
    if (parentKey == null || parentValue == null) {
      return console.error(`Parent ${parentKey} of UIRecord '${siblingKey}' not found.`);
    }

    if (!isUIRecordWithChildren(parentValue)) {
      return console.error(`children of UIRecord '${parentKey}' is not array.`);
    }

    let targetIndex = parentValue.children.findIndex((it) => it.key === siblingKey);
    if (targetIndex < 0) {
      return console.error(`children of UIRecord '${parentKey}' has no UIRecord '${siblingKey}'.`);
    }

    if (method === 'after') {
      targetIndex += 1;
    }

    const targetValue = toUIRecordInstance<ArrayElements<typeof parentValue['children']>>(value, parentValue, { replaceParent: true });

    const newParentChildren = [...parentValue.children];
    newParentChildren.splice(targetIndex, 0, targetValue);

    this.#create(targetValue.key, targetValue, options);
    this.#assign<typeof parentValue>(parentValue.key, { children: newParentChildren });

    this[Protected.dispatchTreeChanges]([...this.pairs.values()], [parentValue, targetValue], []);
  }

  insertBefore<T extends UIRecord | UIRecordData>(nextSiblingKey: UIRecordKey, value: T, options?: UIRecordCreateOptions): void {
    return this.#insert('before', nextSiblingKey, value, options);
  }

  insertAfter<T extends UIRecord | UIRecordData>(prevSiblingKey: UIRecordKey, value: T, options?: UIRecordCreateOptions): void {
    return this.#insert('after', prevSiblingKey, value, options);
  }

  remove(targetKey: UIRecordKey): void {
    const targetValue = this.get(targetKey);
    if (targetValue == null) {
      return console.warn(`UIRecord '${targetKey}' not found.`);
    }

    const canHaveParent = hasUIRecordParent(targetValue);
    const parentKey = canHaveParent ? targetValue.parent.key : undefined;
    const parentValue = this.get(parentKey ?? '');
    const parentExists = isUIRecordKey(parentKey) && parentValue != null;

    if (canHaveParent) {
      (() => {
        if (!parentExists) {
          return console.error(`Parent ${parentKey} of UIRecord '${targetKey}' not found.`);
        }

        if (!isUIRecordWithChildren(parentValue)) {
          return console.error(`children of UIRecord '${parentKey}' is not array.`);
        }

        const targetIndex = parentValue.children.findIndex((it) => it.key === targetKey);
        if (targetIndex < 0) {
          return console.error(`children of UIRecord '${parentKey}' has no UIRecord '${targetKey}'.`);
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
    const selectionChanged = JSON.stringify([...this.#selectedKeys]) !== JSON.stringify(newSelectedKeys);

    if (selectionChanged) {
      this.#selectedKeys.clear();
      newSelectedKeys.forEach((key) => this.#selectedKeys.add(key));
    }

    this[Protected.dispatchTreeChanges]([...this.pairs.values()], parentExists ? [parentValue] : [], deletedKeys);
    if (selectionChanged) {
      this[Protected.dispatchSelectionChanges](newSelectedKeys);
    }
  }

  toggleDraft(targetKey: UIRecordKey, draft: boolean): void {
    const targetValue = this.get(targetKey);
    const targetExists = targetValue != null;

    if (targetExists && draft) {
      this.#draftKeys.add(targetKey);
    } else {
      this.#draftKeys.delete(targetKey);
    }

    if (!targetExists) {
      if (draft) {
        console.error(`UIRecord '${targetKey}' not found.`);
      }
      return;
    }

    this[Protected.dispatchTreeChanges]([...this.pairs.values()], [targetValue], []);
  }

  flushDrafts(): void {
    const newValues = [...this.#draftKeys].map((it) => this.get(it)).filter(nonNullable);
    this.#draftKeys.clear();
    this[Protected.dispatchTreeChanges]([...this.pairs.values()], newValues, []);
  }
}
