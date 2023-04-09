import { UIRecordKey } from '@/types/Identifier';
import { UIDesignToolMode, UIDesignToolStatus, UIDesignToolStatusMeta } from '@/types/Status';
import { makeSymbolicFields } from '@pigyuma/utils';
import { Protected as ExtendsProtected, InstanceEntity, InstanceEntityInit } from './InstanceEntity';
import { UIRecord } from './UIRecord/model';

type ModeListener = (mode: UIDesignToolMode) => void;
type StatusListener = (status: UIDesignToolStatus, meta: UIDesignToolStatusMeta) => void;
type TreeListener = (tree: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void;
type SelectionListener = (selected: UIRecordKey[]) => void;

export interface DataSubscriberConfig extends InstanceEntityInit {}

export const Protected = makeSymbolicFields(
  {
    dispatchModeChanges: 'dispatchModeChanges',
    dispatchStatusChanges: 'dispatchStatusChanges',
    dispatchTreeChanges: 'dispatchTreeChanges',
    dispatchSelectionChanges: 'dispatchSelectionChanges',
  },
  ExtendsProtected,
);

export class DataSubscriber extends InstanceEntity {
  readonly #listeners: {
    readonly mode: Set<ModeListener>;
    readonly status: Set<StatusListener>;
    readonly tree: Set<TreeListener>;
    readonly selection: Set<SelectionListener>;
  };

  constructor(config: DataSubscriberConfig = {}) {
    const { strict, id } = config;

    super({ strict, id });

    this.#listeners = {
      mode: new Set(),
      status: new Set(),
      tree: new Set(),
      selection: new Set(),
    };
  }

  protected [Protected.dispatchModeChanges](...args: Parameters<ModeListener>) {
    this.#listeners.mode.forEach((callback) => callback(...args));
  }

  protected [Protected.dispatchStatusChanges](...args: Parameters<StatusListener>) {
    this.#listeners.status.forEach((callback) => callback(...args));
  }

  protected [Protected.dispatchTreeChanges](...args: Parameters<TreeListener>) {
    this.#listeners.tree.forEach((callback) => callback(...args));
  }

  protected [Protected.dispatchSelectionChanges](...args: Parameters<SelectionListener>) {
    this.#listeners.selection.forEach((callback) => callback(...args));
  }

  subscribeMode(callback: (mode: UIDesignToolMode) => void): void {
    this.#listeners.mode.add(callback);
  }

  unsubscribeMode(callback: (mode: UIDesignToolMode) => void): void {
    this.#listeners.mode.delete(callback);
  }

  subscribeStatus(callback: (status: UIDesignToolStatus, meta: UIDesignToolStatusMeta) => void): void {
    this.#listeners.status.add(callback);
  }

  unsubscribeStatus(callback: (status: UIDesignToolStatus, meta: UIDesignToolStatusMeta) => void): void {
    this.#listeners.status.delete(callback);
  }

  subscribeTree(callback: (all: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void): void {
    this.#listeners.tree.add(callback);
  }

  unsubscribeTree(callback: (all: UIRecord[], changed: UIRecord[], removed: UIRecordKey[]) => void): void {
    this.#listeners.tree.delete(callback);
  }

  subscribeSelection(callback: (selected: UIRecordKey[]) => void): void {
    this.#listeners.selection.add(callback);
  }

  unsubscribeSelection(callback: (selected: UIRecordKey[]) => void): void {
    this.#listeners.selection.delete(callback);
  }
}
