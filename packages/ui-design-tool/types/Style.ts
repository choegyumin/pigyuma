import { createGlobalVar, createGlobalVarName, CSSVarName, CSSVarValue } from '@pigyuma/ui/styles/extensions';
import { mapValues } from '@pigyuma/utils';

export const UIRecordStyle = {
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  rotate: 'rotate',
  strokeColor: 'strokeColor',
  strokePattern: 'strokePattern',
  strokeWidth: 'strokeWidth',
  background: 'background',
  textColor: 'textColor',
  fontSize: 'fontSize',
  lineHeight: 'lineHeight',
  fontWeight: 'fontWeight',
  letterSpacing: 'letterSpacing',
} as const;
export type UIRecordStyle = keyof typeof UIRecordStyle;

export const UIRecordStyleVarNames = mapValues(UIRecordStyle, (value) => createGlobalVarName(value)) as {
  [P in UIRecordStyle]: CSSVarName<P>;
};

export const UIRecordStyleVars = mapValues(UIRecordStyle, (value) => createGlobalVar(value)) as { [P in UIRecordStyle]: CSSVarValue<P> };
