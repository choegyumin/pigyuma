import createVarName from './createVarName';
import { CSSGlobalVarFunction } from './types';

export default function createVarFunction<T extends string>(name: T): CSSGlobalVarFunction<T> {
  return `var(${createVarName<T>(name)})`;
}
