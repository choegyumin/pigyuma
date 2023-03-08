export type CSSVarName = `--${string}`;

export type { CSSVarFunction } from '@vanilla-extract/private';

export type CSSGlobalVarName<T extends string> = `--${T}`;

export type CSSGlobalVarFunction<T extends string> = `var(--${T})`;
