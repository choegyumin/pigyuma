import { createGlobalTheme } from '@vanilla-extract/css';
import { CSSGlobalVarFunction } from './types';

export default function createGlobalVar<T extends string>(selector: string, name: T, token: string): CSSGlobalVarFunction<T> {
  return createGlobalTheme(selector, { [name]: token })[name] as CSSGlobalVarFunction<T>;
}
