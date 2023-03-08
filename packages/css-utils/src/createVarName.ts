import { CSSGlobalVarName } from './types';

export default function createVarName<T extends string>(name: T): CSSGlobalVarName<T> {
  return `--${name}`;
}
