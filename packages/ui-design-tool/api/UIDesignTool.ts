import { UIDesignToolMode, UIDesignToolStatus } from '@/types/Status';
import { makeSymbolicFields } from '@pigyuma/utils';
import { Protected as ExtendsProtected, ModelStore, ModelStoreConfig } from './ModelStore';

export interface UIDesignToolConfig extends ModelStoreConfig {}

export const Protected = makeSymbolicFields({}, ExtendsProtected);

/**
 * @todo Design token 모델 및 관리 방식 설계
 * @todo History 관리 방식 설계
 * @todo Exception 발생 및 처리 기준 정의
 */
export class UIDesignTool extends ModelStore {
  #mounted: boolean;

  constructor(config: UIDesignToolConfig = {}) {
    const { strict, id } = config;

    super({ strict, id });

    this.#mounted = false;
  }

  get mounted() {
    return this.#mounted;
  }

  mount() {
    if (this.#mounted) {
      const message = 'UIDesignTool already mounted.';

      if (this[Protected.strict]) {
        throw new Error(message);
      } else {
        console.error(message);
      }
    } else {
      this.#mounted = true;
      this[Protected.registerEvents]();
    }

    // 외부에 노출할 필요가 없는 인터페이스는, 내부(UIDesignCanvas)에서만 사용하도록 `mount` 함수의 반환 값으로 은닉
    return {
      getBrowserStatus: () => this[Protected.browserStatus],
      setStatus: (status: UIDesignToolStatus) => this[Protected.setStatus](status),
    };
  }

  unmount() {
    if (!this.#mounted) {
      console.warn('UIDesignTool is not mounted.');
    }

    this[Protected.deregisterEvents]();
    this.#mounted = false;
    this.toggleMode(UIDesignToolMode.select);
    this[Protected.setStatus](UIDesignToolStatus.idle);
  }
}
