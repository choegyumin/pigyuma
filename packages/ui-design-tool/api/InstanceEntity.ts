import { makeSymbolicFields, uuid } from '@pigyuma/utils';

export interface InstanceEntityInit {
  strict?: boolean;
  id?: string;
}

export const Protected = makeSymbolicFields({
  strict: 'strict',
});

export class InstanceEntity {
  readonly #strict: boolean;
  readonly #id: string;

  constructor(init: InstanceEntityInit = {}) {
    const { strict = true, id = uuid.v4() } = init;

    this.#strict = strict;
    this.#id = id;
  }

  protected get [Protected.strict]() {
    return this.#strict;
  }

  get id(): string {
    return this.#id;
  }
}
