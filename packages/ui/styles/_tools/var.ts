import { mapValues } from '@pigyuma/utils';
import { createGlobalTheme } from '@vanilla-extract/css';
import { CSSVarFunction, getVarName } from '@vanilla-extract/private';

export type CSSVarName = `--${string}`;
export type { CSSVarFunction } from '@vanilla-extract/private';
export type CSSGlobalVarName<T extends string> = `--${T}`;
export type CSSGlobalVarFunction<T extends string> = `var(--${T})`;

export function isVarName<T extends string>(value: unknown): value is CSSGlobalVarName<T> {
  return typeof value === 'string' && value.startsWith('--');
}

export function isVarFunction<T extends string>(value: unknown): value is CSSGlobalVarFunction<T> {
  return typeof value === 'string' && value.startsWith('var(') && value.endsWith(')');
}

export function createVarName<T extends string>(name: T): CSSGlobalVarName<T> {
  return `--${name}`;
}

export function createVarFunction<T extends string>(name: T): CSSGlobalVarFunction<T> {
  return `var(${createVarName<T>(name)})`;
}

export { createVar } from '@vanilla-extract/css';

export function createGlobalVar<T extends string>(selector: string, name: T, token: string): CSSGlobalVarFunction<T> {
  return createGlobalTheme(selector, { [name]: token })[name] as CSSGlobalVarFunction<T>;
}

export { fallbackVar } from '@vanilla-extract/css';

export { assignVars } from '@vanilla-extract/css';

export { getVarName } from '@vanilla-extract/private';

export function getVarNames<T extends Record<string, CSSVarFunction>>(vars: T): Record<keyof T, ReturnType<typeof getVarName>> {
  return mapValues(vars, (value) => getVarName(value));
}
