import { UIDesignToolMode, UIDesignToolStatus } from '@/types/Status';
import { cloneDeep, makeSymbolicFields, uuid } from '@pigyuma/utils';
import { DataStore } from './DataStore';
import { DOMSelector } from './DOMSelector';

export interface ExtendedGetters extends DOMSelector, DataStore {}

const _protected = makeSymbolicFields({
  strict: 'strict',
});

export interface UIDesignToolConfig {
  id?: string;
  strict?: boolean;
}

export interface UIDesignToolConstructor {
  new (config?: UIDesignToolConfig): typeof UIDesignTool;
}

/**
 * @todo Design token 모델 및 관리 방식 설계
 * @todo History 관리 방식 설계
 * @todo Exception 발생 및 처리 기준 정의
 */
// @ts-ignore
export class UIDesignTool implements ExtendedGetters {
  readonly #id: string;
  readonly #strict: boolean;

  #data: DataStore;
  #dom: DOMSelector;

  #mounted: boolean;

  constructor(config: UIDesignToolConfig = {}) {
    const { id = uuid.v4(), strict = true } = config;

    this.#id = id;
    this.#strict = strict;

    this.#data = new DataStore({ id });
    this.#dom = new DOMSelector({ id });

    this.#mounted = false;
  }

  /**
   * Protected field names
   * @protected
   * @experimental Do not access outside of instance. If JavaScript supports `protected` keyword, it can be removed.
   */
  static get _() {
    return _protected;
  }

  protected get [_protected.strict]() {
    return this.#strict;
  }

  get id(): string {
    return this.#id;
  }

  get mounted() {
    return this.#mounted;
  }

  mount() {
    if (this.#mounted) {
      if (this.#strict) {
        throw new Error('UIDesignTool already mounted.');
      }
    } else {
      this.#mounted = true;
      this.#dom[DOMSelector._.registerEvents]();
    }

    // 외부에 노출할 필요가 없는 인터페이스는, 내부(UIDesignCanvas)에서만 사용하도록 `mount` 함수의 반환 값으로 은닉
    return {
      // 클래스 외부 함수로 추출하면서 참조 제거
      getBrowserStatus: () => cloneDeep({ ...this.#dom[DOMSelector._.browserStatus] }),
      setStatus: (status: UIDesignToolStatus) => this.#data[DataStore._.setStatus](status),
    };
  }

  unmount() {
    if (!this.#mounted) {
      if (this.#strict) {
        console.warn('UIDesignTool is not mounted.');
      }
    }

    this.#dom[DOMSelector._.deregisterEvents]();
    this.#mounted = false;
    this.#data.toggleMode(UIDesignToolMode.select);
    this.#data[DataStore._.setStatus](UIDesignToolStatus.idle);
  }

  // prettier-ignore
  subscribeMode(...args: Parameters<DataStore['subscribeMode']>) { return this.#data.subscribeMode(...args); }
  // prettier-ignore
  unsubscribeMode(...args: Parameters<DataStore['unsubscribeMode']>) { return this.#data.unsubscribeMode(...args); }
  // prettier-ignore
  subscribeStatus(...args: Parameters<DataStore['subscribeStatus']>) { return this.#data.subscribeStatus(...args); }
  // prettier-ignore
  unsubscribeStatus(...args: Parameters<DataStore['unsubscribeStatus']>) { return this.#data.unsubscribeStatus(...args); }
  // prettier-ignore
  subscribeTree(...args: Parameters<DataStore['subscribeTree']>) { return this.#data.subscribeTree(...args); }
  // prettier-ignore
  unsubscribeTree(...args: Parameters<DataStore['unsubscribeTree']>) { return this.#data.unsubscribeTree(...args); }
  // prettier-ignore
  subscribeSelection(...args: Parameters<DataStore['subscribeSelection']>) { return this.#data.subscribeSelection(...args); }
  // prettier-ignore
  unsubscribeSelection(...args: Parameters<DataStore['unsubscribeSelection']>) { return this.#data.unsubscribeSelection(...args); }

  // prettier-ignore
  subscribeHovering(...args: Parameters<DOMSelector['subscribeHovering']>) { return this.#dom.subscribeHovering(...args); }
  // prettier-ignore
  unsubscribeHovering(...args: Parameters<DOMSelector['unsubscribeHovering']>) { return this.#dom.unsubscribeHovering(...args); }

  // prettier-ignore
  get mode() { return this.#data.mode; }
  // prettier-ignore
  get status() { return this.#data.status; }
  // prettier-ignore
  get interactionType() { return this.#data.interactionType; }
  // prettier-ignore
  get transformMethod() { return this.#data.transformMethod; }
  // prettier-ignore
  get tree() { return this.#data.tree; }
  // prettier-ignore
  get pairs() { return this.#data.pairs; }
  // prettier-ignore
  get drafts() { return this.#data.drafts; }
  // prettier-ignore
  get selected() { return this.#data.selected; }
  // prettier-ignore
  toggleMode(...args: Parameters<DataStore['toggleMode']>) { return this.#data.toggleMode(...args); }
  // prettier-ignore
  reset(...args: Parameters<DataStore['reset']>) { return this.#data.reset(...args); }
  // prettier-ignore
  select(...args: Parameters<DataStore['select']>) { return this.#data.select(...args); }
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(...args: Parameters<DataStore['get']>) { return this.#data.get<any>(...args); }
  // prettier-ignore
  has(...args: Parameters<DataStore['has']>) { return this.#data.has(...args); }
  // prettier-ignore
  isDraft(...args: Parameters<DataStore['isDraft']>) { return this.#data.isDraft(...args); }
  // prettier-ignore
  isSelected(...args: Parameters<DataStore['isSelected']>) { return this.#data.isSelected(...args); }
  // prettier-ignore
  set(...args: Parameters<DataStore['set']>) { return this.#data.set(...args); }
  // prettier-ignore
  setRect(...args: Parameters<DataStore['setRect']>) { return this.#data.setRect(...args); }
  // prettier-ignore
  move(...args: Parameters<DataStore['move']>) { return this.#data.move(...args); }
  // prettier-ignore
  append(...args: Parameters<DataStore['append']>) { return this.#data.append(...args); }
  // prettier-ignore
  prepend(...args: Parameters<DataStore['prepend']>) { return this.#data.prepend(...args); }
  // prettier-ignore
  insertBefore(...args: Parameters<DataStore['insertBefore']>) { return this.#data.insertBefore(...args); }
  // prettier-ignore
  insertAfter(...args: Parameters<DataStore['insertAfter']>) { return this.#data.insertAfter(...args); }
  // prettier-ignore
  remove(...args: Parameters<DataStore['remove']>) { return this.#data.remove(...args); }
  // prettier-ignore
  toggleDraft(...args: Parameters<DataStore['toggleDraft']>) { return this.#data.toggleDraft(...args); }
  // prettier-ignore
  flushDrafts(...args: Parameters<DataStore['flushDrafts']>) { return this.#data.flushDrafts(...args); }

  //prettier-ignore
  get hovered() { return this.#dom.hovered; }
  //prettier-ignore
  get root() { return this.#dom.root; }
  //prettier-ignore
  dataset(...args: Parameters<DOMSelector['dataset']>) { return this.#dom.dataset(...args); }
  //prettier-ignore
  matches(...args: Parameters<DOMSelector['matches']>) { return this.#dom.matches(...args); }
  //prettier-ignore
  closest(...args: Parameters<DOMSelector['closest']>) { return this.#dom.closest(...args); }
  //prettier-ignore
  query(...args: Parameters<DOMSelector['query']>) { return this.#dom.query(...args); }
  //prettier-ignore
  queryAll(...args: Parameters<DOMSelector['queryAll']>) { return this.#dom.queryAll(...args); }
  //prettier-ignore
  fromPoint(...args: Parameters<DOMSelector['fromPoint']>) { return this.#dom.fromPoint(...args); }
}
