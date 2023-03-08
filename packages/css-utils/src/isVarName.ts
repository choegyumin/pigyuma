import { CSSGlobalVarName } from './types';

export default function isVarName<T extends string>(value: unknown): value is CSSGlobalVarName<T> {
  return typeof value === 'string' && value.startsWith('--');
}
