import { mapValues } from '@pigyuma/utils';
import { getVarName } from '@vanilla-extract/private';
import { CSSVarFunction } from './types';

export default function getVarNames<T extends Record<string, CSSVarFunction>>(vars: T): Record<keyof T, ReturnType<typeof getVarName>> {
  return mapValues(vars, (value) => getVarName(value));
}
