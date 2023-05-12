import { BrowserStatus } from '@/types/Browser';
import {
  UIDesignToolElementDataAttributeName,
  UIRecordElementDataset,
  UIRecordElementFilter,
  UIRecordElementFilterItem,
  UIRecordKey,
  UIRecordType,
} from '@/types/Identifier';
import { createUIRecordSelector, NULL_ELEMENT_SELECTOR } from '@/utils/selector';
import { makeSymbolicFields, mapValues, uuid } from '@pigyuma/utils';
import { DOMSubscriber } from './DOMSubscriber';

export const INITIAL_BROWSER_STATUS: BrowserStatus = {
  mouse: { clientX: 0, clientY: 0, offsetX: 0, offsetY: 0, down: false },
  keyboard: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false },
};

const makeRootSelector = (id: string): string => `[${UIDesignToolElementDataAttributeName.id}="${id}"]`;

const _protected = makeSymbolicFields(
  {
    browserStatus: 'browserStatus',
    registerEvents: 'registerEvents',
    deregisterEvents: 'deregisterEvents',
  },
  DOMSubscriber._,
);

export interface DOMSelectorConfig {
  id?: string;
}

export interface DOMSelectorConstructor {
  new (config?: DOMSelectorConfig): DOMSelector;
}

/** @todo 테스트 코드 고도화 */
export class DOMSelector extends DOMSubscriber {
  readonly #id: string;
  readonly #browserStatus: BrowserStatus;

  #hoveredKey: UIRecordKey | undefined;

  readonly #eventHandlers: {
    onMouseMove: (event: MouseEvent) => void;
    onMouseDown: (event: MouseEvent) => void;
    onMouseUp: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
  };

  constructor(config: DOMSelectorConfig = {}) {
    const { id = uuid.v4() } = config;

    super();

    this.#id = id;
    this.#browserStatus = INITIAL_BROWSER_STATUS;

    this.#hoveredKey = undefined;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const target = this.fromPoint(clientX, clientY);
      const rootBounds = this.root?.getBoundingClientRect() ?? new DOMRect();
      this.#browserStatus.mouse.clientX = clientX;
      this.#browserStatus.mouse.clientY = clientY;
      this.#browserStatus.mouse.offsetX = clientX - rootBounds.x;
      this.#browserStatus.mouse.offsetY = clientY - rootBounds.y;
      const hoveredKey = this.dataset(target).key;
      this.#hoveredKey = hoveredKey;
      this[_protected.dispatchHoveringChanges](hoveredKey);
    };

    const onMouseDown = () => {
      this.#browserStatus.mouse.down = true;
    };

    const onMouseUp = () => {
      this.#browserStatus.mouse.down = false;
    };

    const onKeyDownUp = (event: KeyboardEvent) => {
      const { key, altKey, ctrlKey, metaKey, shiftKey } = event;
      this.#browserStatus.keyboard.altKey = altKey;
      this.#browserStatus.keyboard.ctrlKey = ctrlKey;
      this.#browserStatus.keyboard.metaKey = metaKey;
      this.#browserStatus.keyboard.shiftKey = shiftKey;
      const focused = document.activeElement?.closest(this.#rootSelector);
      const mouseDown = this.#browserStatus.mouse.down;
      const modifierKeyDown = ['Alt', 'Control', 'Meta', 'Shift'].includes(key);
      if (focused && (mouseDown || modifierKeyDown)) {
        event.preventDefault();
      }
    };

    this.#eventHandlers = {
      onMouseMove,
      onMouseDown,
      onMouseUp,
      onKeyDown: onKeyDownUp,
      onKeyUp: onKeyDownUp,
    };
  }

  /**
   * Protected field names
   * @protected
   * @experimental Do not access outside of instance. If JavaScript supports `protected` keyword, it can be removed.
   */
  static get _() {
    return _protected;
  }

  protected get [_protected.browserStatus]() {
    return this.#browserStatus;
  }

  protected [_protected.registerEvents]() {
    document.addEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
    document.addEventListener('mousedown', this.#eventHandlers.onMouseDown, { capture: true });
    document.addEventListener('mouseup', this.#eventHandlers.onMouseUp, { capture: true });
    document.addEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
    document.addEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });
  }

  protected [_protected.deregisterEvents]() {
    document.removeEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
    document.removeEventListener('mousedown', this.#eventHandlers.onMouseDown, { capture: true });
    document.removeEventListener('mouseup', this.#eventHandlers.onMouseUp, { capture: true });
    document.removeEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
    document.removeEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });
    this.#browserStatus.mouse.clientX = INITIAL_BROWSER_STATUS.mouse.clientX;
    this.#browserStatus.mouse.clientY = INITIAL_BROWSER_STATUS.mouse.clientY;
    this.#browserStatus.keyboard.altKey = INITIAL_BROWSER_STATUS.keyboard.altKey;
    this.#browserStatus.keyboard.ctrlKey = INITIAL_BROWSER_STATUS.keyboard.ctrlKey;
    this.#browserStatus.keyboard.metaKey = INITIAL_BROWSER_STATUS.keyboard.metaKey;
    this.#browserStatus.keyboard.shiftKey = INITIAL_BROWSER_STATUS.keyboard.shiftKey;
    this.#hoveredKey = undefined;
    this[_protected.dispatchHoveringChanges](undefined);
  }

  get hovered(): UIRecordKey | undefined {
    return this.#hoveredKey;
  }

  static root(id: string): HTMLElement | null {
    return document.querySelector<HTMLElement>(makeRootSelector(id));
  }

  get root(): HTMLElement | null {
    return document.querySelector<HTMLElement>(this.#rootSelector);
  }

  get #rootSelector(): string {
    return makeRootSelector(this.#id);
  }

  static dataset(element: Element | null): { key: string | undefined; type: string | undefined; layerType: string | undefined } {
    return mapValues(UIRecordElementDataset, (datasetKey) => (element as Partial<HTMLElement | SVGElement> | null)?.dataset?.[datasetKey]);
  }

  dataset(element: Element | null): { key: string | undefined; type: string | undefined; layerType: string | undefined } {
    return DOMSelector.dataset(element);
  }

  static matches(element: Element | null, filter: UIRecordElementFilter): boolean {
    const selector = createUIRecordSelector(filter);
    return element?.matches(selector) ?? false;
  }

  matches(element: Element | null, filter: UIRecordElementFilter): boolean {
    return DOMSelector.matches(element, filter);
  }

  static closest(target: UIRecordElementFilter, current: UIRecordElementFilter | Element | null): HTMLElement | null {
    const from = current instanceof Element || current == null ? current : document.querySelector(createUIRecordSelector(current));
    const targetSelector = createUIRecordSelector(target);
    return from?.closest<HTMLElement>(targetSelector) ?? null;
  }

  closest(target: UIRecordElementFilter, current: UIRecordElementFilter | Element | null): HTMLElement | null {
    return DOMSelector.closest(target, current);
  }

  static query(target: UIRecordElementFilterItem, container: UIRecordElementFilter | Element | null): HTMLElement | null {
    if (container == null) {
      return null;
    }
    const from = container instanceof Element ? container : document.querySelector(createUIRecordSelector(container));
    const targetSelector = createUIRecordSelector(target);
    return from?.querySelector<HTMLElement>(targetSelector) ?? null;
  }

  query(target: UIRecordElementFilterItem, container?: UIRecordElementFilter | Element | null): HTMLElement | null {
    return DOMSelector.query(target, container ?? this.root);
  }

  static queryAll(target: UIRecordElementFilter, container: UIRecordElementFilter | Element | null): NodeListOf<HTMLElement> {
    if (container == null) {
      return document.querySelectorAll(NULL_ELEMENT_SELECTOR);
    }
    const from = container instanceof Element ? container : document.querySelector(createUIRecordSelector(container));
    const targetSelector = createUIRecordSelector(target);
    return from?.querySelectorAll<HTMLElement>(targetSelector) ?? document.querySelectorAll(NULL_ELEMENT_SELECTOR);
  }

  queryAll(target: UIRecordElementFilter, container?: UIRecordElementFilter | Element | null): NodeListOf<HTMLElement> {
    return DOMSelector.queryAll(target, container ?? this.root);
  }

  static fromPoint(x: number, y: number): HTMLElement | null {
    return this.closest([{ type: UIRecordType.artboard }, { type: UIRecordType.layer }], document.elementFromPoint(x, y)) ?? null;
  }

  fromPoint(x: number, y: number): HTMLElement | null {
    return DOMSelector.fromPoint(x, y);
  }
}
