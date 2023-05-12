import { UIRecordKey } from '@/types/Identifier';
import { makeSymbolicFields } from '@pigyuma/utils';

const _protected = makeSymbolicFields({
  dispatchHoveringChanges: 'dispatchHoveringChanges',
});

type HoveringListener = (hovered: UIRecordKey | undefined) => void;

/** @todo 테스트 코드 고도화 */
export class DOMSubscriber {
  readonly #hovering: Set<HoveringListener>;

  constructor() {
    this.#hovering = new Set();
  }

  /**
   * Protected field names
   * @protected
   * @experimental Do not access outside of instance. If JavaScript supports `protected` keyword, it can be removed.
   */
  static get _() {
    return _protected;
  }

  protected [_protected.dispatchHoveringChanges](...args: Parameters<HoveringListener>) {
    this.#hovering.forEach((callback) => callback(...args));
  }

  subscribeHovering(callback: (hovered?: UIRecordKey) => void): void {
    this.#hovering.add(callback);
  }

  unsubscribeHovering(callback: (hovered?: UIRecordKey) => void): void {
    this.#hovering.delete(callback);
  }
}
