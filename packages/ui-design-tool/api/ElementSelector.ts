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
import { makeSymbolicFields, mapValues } from '@pigyuma/utils';
import { Protected as ExtendsProtected, DataSubscriber, DataSubscriberConfig } from './DataSubscriber';

export const INITIAL_BROWSER_STATUS: BrowserStatus = {
  mouse: { clientX: 0, clientY: 0, offsetX: 0, offsetY: 0 },
  keyboard: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false },
};

export interface ElementSelectorConfig extends DataSubscriberConfig {}

export const Protected = makeSymbolicFields(
  {
    browserStatus: 'browserStatus',
    registerEvents: 'registerEvents',
    deregisterEvents: 'deregisterEvents',
  },
  ExtendsProtected,
);

/**
 * 하나로 완성되어야 의미가 있는 클래스를 코드와 관심사만 적절히 분할하는 것이 목적이므로,
 * 객체 지향 프로그래밍의 사고방식에 맞추기보다, 사용하기 쉬운 인터페이스 형태로 제공하는 것을 목표로 함.
 * 자식 클래스가 DataSubscriber를 확장하고, ElementSelector 인스턴스를 새로운 프로퍼티에 할당하는 대신,
 * ElementSelector가 DataSubscriber를 확장하는 형태로 구현.
 *
 * @todo 테스트 코드 고도화
 */
export class ElementSelector extends DataSubscriber {
  readonly #browserStatus: BrowserStatus;

  #hoveredKey: UIRecordKey | undefined;

  readonly #eventHandlers: {
    onMouseMove: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
  };

  constructor(config: ElementSelectorConfig = {}) {
    const { strict, id } = config;

    super({ strict, id });

    this.#browserStatus = INITIAL_BROWSER_STATUS;

    this.#hoveredKey = undefined;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const target = this.fromPoint(clientX, clientY);
      const rootBounds = document.querySelector(this.#rootElementSelector)?.getBoundingClientRect() ?? new DOMRect();
      this.#browserStatus.mouse.clientX = clientX;
      this.#browserStatus.mouse.clientY = clientY;
      this.#browserStatus.mouse.offsetX = clientX - rootBounds.x;
      this.#browserStatus.mouse.offsetY = clientY - rootBounds.y;
      const hoveredKey = this.dataset(target).key;
      this.#hoveredKey = hoveredKey;
      this[Protected.dispatchHoveringChanges](hoveredKey);
    };
    const onKeyDownUp = (event: KeyboardEvent) => {
      const { altKey, ctrlKey, metaKey, shiftKey } = event;
      this.#browserStatus.keyboard.altKey = altKey;
      this.#browserStatus.keyboard.ctrlKey = ctrlKey;
      this.#browserStatus.keyboard.metaKey = metaKey;
      this.#browserStatus.keyboard.shiftKey = shiftKey;
    };
    this.#eventHandlers = {
      onMouseMove,
      onKeyDown: onKeyDownUp,
      onKeyUp: onKeyDownUp,
    };
  }

  get #rootElementSelector(): string {
    return `[${UIDesignToolElementDataAttributeName.id}="${this.id}"]`;
  }

  protected get [Protected.browserStatus]() {
    return this.#browserStatus;
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
    this.#browserStatus.mouse.clientX = INITIAL_BROWSER_STATUS.mouse.clientX;
    this.#browserStatus.mouse.clientY = INITIAL_BROWSER_STATUS.mouse.clientY;
    this.#browserStatus.keyboard.altKey = INITIAL_BROWSER_STATUS.keyboard.altKey;
    this.#browserStatus.keyboard.ctrlKey = INITIAL_BROWSER_STATUS.keyboard.ctrlKey;
    this.#browserStatus.keyboard.metaKey = INITIAL_BROWSER_STATUS.keyboard.metaKey;
    this.#browserStatus.keyboard.shiftKey = INITIAL_BROWSER_STATUS.keyboard.shiftKey;
    this.#hoveredKey = undefined;
    this[Protected.dispatchHoveringChanges](undefined);
  }

  get hovered(): UIRecordKey | undefined {
    return this.#hoveredKey;
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
}
