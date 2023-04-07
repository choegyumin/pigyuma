import { BrowserMeta } from '@/types/Browser';
import {
  UIDesignToolElementDataAttributeName,
  UIRecordElementDataset,
  UIRecordElementFilter,
  UIRecordElementFilterItem,
  UIRecordType,
} from '@/types/Identifier';
import { createUIRecordSelector, NULL_ELEMENT_SELECTOR } from '@/utils/selector';
import { makeSymbolicFields, mapValues, uuid } from '@pigyuma/utils';

export const INITIAL_DOCUMENT_ID = 'UNKNOWN';

export const INITIAL_BROWSER_META: BrowserMeta = {
  mouse: { clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 },
  keyboard: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false },
};

export interface UIDesignToolDOMOptions {
  id?: string;
}

export const Protected = makeSymbolicFields({
  browserMeta: 'browserMeta',
  registerEvents: 'registerEvents',
  deregisterEvents: 'deregisterEvents',
});

export class UIDesignToolDOM {
  readonly #id: string;
  readonly #browserMeta: BrowserMeta;

  #hoveredElement: HTMLElement | null;

  readonly #eventHandlers: {
    onMouseMove: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
  };

  constructor(options: UIDesignToolDOMOptions = {}) {
    const { id = uuid.v4() } = options;

    this.#id = id;
    this.#browserMeta = INITIAL_BROWSER_META;

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

  get id(): string {
    return this.#id;
  }

  protected get [Protected.browserMeta](): BrowserMeta {
    return this.#browserMeta;
  }

  get #rootElementSelector(): string {
    return `[${UIDesignToolElementDataAttributeName.id}="${this.id}"]`;
  }

  protected [Protected.registerEvents]() {
    document.addEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
    document.addEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
    document.addEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });
  }

  protected [Protected.deregisterEvents]() {
    document.removeEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
    document.removeEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
    document.removeEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });
    this.#browserMeta.mouse.clientX = INITIAL_BROWSER_META.mouse.clientX;
    this.#browserMeta.mouse.clientY = INITIAL_BROWSER_META.mouse.clientY;
    this.#browserMeta.keyboard.altKey = INITIAL_BROWSER_META.keyboard.altKey;
    this.#browserMeta.keyboard.ctrlKey = INITIAL_BROWSER_META.keyboard.ctrlKey;
    this.#browserMeta.keyboard.metaKey = INITIAL_BROWSER_META.keyboard.metaKey;
    this.#browserMeta.keyboard.shiftKey = INITIAL_BROWSER_META.keyboard.shiftKey;
    this.#hoveredElement = null;
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
