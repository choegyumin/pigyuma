import { UIDesignToolMode, UIDesignToolStatus } from '@/types/Status';
import { cloneDeep, makeSymbolicFields, uuid } from '@pigyuma/utils';
import { DataStore as DataStore } from './DataStore';
import { DOMSelector as DOMSelector } from './DOMSelector';

export interface UIDesignToolConfig {
  id?: string;
  strict?: boolean;
}

const _protected = makeSymbolicFields({
  strict: 'strict',
});

/**
 * @todo Design token 모델 및 관리 방식 설계
 * @todo History 관리 방식 설계
 * @todo Exception 발생 및 처리 기준 정의
 */
export class UIDesignTool {
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
}
