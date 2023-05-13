import { UIRecord } from '@/models/UIRecord/model';
import { UIRecordKey } from '@/types/Identifier';
import { UIDesignToolMode, UIDesignToolStatus, UIDesignToolStatusMetadata } from '@/types/Status';
import { makeSymbolicFields } from '@pigyuma/utils';

const _protected = makeSymbolicFields({
  dispatchModeChanges: 'dispatchModeChanges',
  dispatchStatusChanges: 'dispatchStatusChanges',
  dispatchTreeChanges: 'dispatchTreeChanges',
  dispatchSelectionChanges: 'dispatchSelectionChanges',
});

type ModeListener = (mode: UIDesignToolMode) => void;
type StatusListener = (status: UIDesignToolStatus, meta: UIDesignToolStatusMetadata) => void;
type TreeListener = (tree: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void;
type SelectionListener = (selected: UIRecordKey[]) => void;

export interface DataSubscriberConstructor {
  new (): DataSubscriber;
}

/** @todo 테스트 코드 고도화 */
export class DataSubscriber {
  readonly #mode: Set<ModeListener>;
  readonly #status: Set<StatusListener>;
  readonly #tree: Set<TreeListener>;
  readonly #selection: Set<SelectionListener>;

  constructor() {
    this.#mode = new Set();
    this.#status = new Set();
    this.#tree = new Set();
    this.#selection = new Set();
  }

  /**
   * Protected field names
   * @protected
   * @experimental Do not access outside of instance. If JavaScript supports `protected` keyword, it can be removed.
   */
  static get _() {
    return _protected;
  }

  protected [_protected.dispatchModeChanges](...args: Parameters<ModeListener>) {
    this.#mode.forEach((callback) => callback(...args));
  }

  protected [_protected.dispatchStatusChanges](...args: Parameters<StatusListener>) {
    this.#status.forEach((callback) => callback(...args));
  }

  protected [_protected.dispatchTreeChanges](...args: Parameters<TreeListener>) {
    this.#tree.forEach((callback) => callback(...args));
  }

  protected [_protected.dispatchSelectionChanges](...args: Parameters<SelectionListener>) {
    this.#selection.forEach((callback) => callback(...args));
  }

  subscribeMode(callback: (mode: UIDesignToolMode) => void): void {
    this.#mode.add(callback);
  }

  unsubscribeMode(callback: (mode: UIDesignToolMode) => void): void {
    this.#mode.delete(callback);
  }

  subscribeStatus(callback: (status: UIDesignToolStatus, meta: UIDesignToolStatusMetadata) => void): void {
    this.#status.add(callback);
  }

  unsubscribeStatus(callback: (status: UIDesignToolStatus, meta: UIDesignToolStatusMetadata) => void): void {
    this.#status.delete(callback);
  }

  subscribeTree(callback: (all: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void): void {
    this.#tree.add(callback);
  }

  unsubscribeTree(callback: (all: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void): void {
    this.#tree.delete(callback);
  }

  subscribeSelection(callback: (selected: UIRecordKey[]) => void): void {
    this.#selection.add(callback);
  }

  unsubscribeSelection(callback: (selected: UIRecordKey[]) => void): void {
    this.#selection.delete(callback);
  }
}
