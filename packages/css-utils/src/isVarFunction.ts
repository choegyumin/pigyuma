import { CSSGlobalVarFunction } from './types';

export default function isVarFunction<T extends string>(value: unknown): value is CSSGlobalVarFunction<T> {
  return typeof value === 'string' && value.startsWith('var(') && value.endsWith(')');
}
