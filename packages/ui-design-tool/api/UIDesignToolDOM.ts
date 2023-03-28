import { BrowserMeta } from '@/types/Browser';
import {
  UIDesignToolElementDataAttributeName,
  UIRecordElementDataset,
  UIRecordElementFilter,
  UIRecordElementFilterItem,
  UIRecordType,
} from '@/types/Identifier';
import { createUIRecordSelector, NULL_ELEMENT_SELECTOR } from '@/utils/selector';
import { mapValues, uuid } from '@pigyuma/utils';

export const INITIAL_DOCUMENT_ID = 'UNKNOWN';

export const INITIAL_BROWSER_META: BrowserMeta = {
  mouse: { clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 },
  keyboard: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false },
};

export interface UIDesignToolDOMOptions {
  id?: string;
}

export class UIDesignToolDOM {
  readonly #id: string;
  protected readonly _browserMeta: BrowserMeta;

  #hoveredElement: HTMLElement | null;

  readonly #eventHandlers: {
    onMouseMove: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
  };

  constructor(options: UIDesignToolDOMOptions = {}) {
    const { id = uuid.v4() } = options;

    this.#id = id;
    this._browserMeta = INITIAL_BROWSER_META;

    this.#hoveredElement = null;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const target = this.fromPoint(clientX, clientY);
      const rootBounds = document.querySelector(this.#rootElementSelector)?.getBoundingClientRect() ?? new DOMRect();
      this._browserMeta.mouse.clientX = clientX;
      this._browserMeta.mouse.clientY = clientY;
      this._browserMeta.mouse.offsetX = clientX - rootBounds.x;
      this._browserMeta.mouse.offsetY = clientY - rootBounds.y;
      this.#hoveredElement = target;
    };
    const onKeyDownUp = (event: KeyboardEvent) => {
      const { altKey, ctrlKey, metaKey, shiftKey } = event;
      this._browserMeta.keyboard.altKey = altKey;
      this._browserMeta.keyboard.ctrlKey = ctrlKey;
      this._browserMeta.keyboard.metaKey = metaKey;
      this._browserMeta.keyboard.shiftKey = shiftKey;
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

  get #rootElementSelector(): string {
    return `[${UIDesignToolElementDataAttributeName.id}="${this.id}"]`;
  }

  protected _mountEvents() {
    document.addEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
    document.addEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
    document.addEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });
  }

  protected _unmountEvents() {
    document.removeEventListener('mousemove', this.#eventHandlers.onMouseMove, { capture: true });
    document.removeEventListener('keydown', this.#eventHandlers.onKeyDown, { capture: true });
    document.removeEventListener('keyup', this.#eventHandlers.onKeyUp, { capture: true });
    this._browserMeta.mouse.clientX = INITIAL_BROWSER_META.mouse.clientX;
    this._browserMeta.mouse.clientY = INITIAL_BROWSER_META.mouse.clientY;
    this._browserMeta.keyboard.altKey = INITIAL_BROWSER_META.keyboard.altKey;
    this._browserMeta.keyboard.ctrlKey = INITIAL_BROWSER_META.keyboard.ctrlKey;
    this._browserMeta.keyboard.metaKey = INITIAL_BROWSER_META.keyboard.metaKey;
    this._browserMeta.keyboard.shiftKey = INITIAL_BROWSER_META.keyboard.shiftKey;
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
