import { mapValues } from '@pigyuma/utils';
import { CSSVarFunction, getVarName } from '@vanilla-extract/private';

export type CSSVarName<T extends string> = `--${T}`;
export type CSSVarValue<T extends string> = `var(--${T})`;
export type CSSVarValueWithFallback<T extends string, F extends string | number> = `var(--${T}, ${F})`;

export const createGlobalVarName = function createGlobalVarName<T extends string>(name: T): CSSVarName<T> {
  return `--${name}`;
};

export const createGlobalVar = function createGlobalVar<T extends string>(name: T): CSSVarValue<T> {
  return `var(--${name})`;
};

export const getVarNames = function getVarNames<T extends Record<string, CSSVarFunction>>(
  vars: T,
): Record<keyof T, ReturnType<typeof getVarName>> {
  return mapValues(vars, (value) => getVarName(value));
};
