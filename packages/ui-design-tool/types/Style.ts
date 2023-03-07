import { createVarFunction, createVarName, CSSGlobalVarName, CSSGlobalVarFunction } from '@pigyuma/ui/extensions';
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

export const UIRecordStyleVarNames = mapValues(UIRecordStyle, (value) => createVarName(value)) as {
  [P in UIRecordStyle]: CSSGlobalVarName<P>;
};

export const UIRecordStyleVars = mapValues(UIRecordStyle, (value) => createVarFunction(value)) as {
  [P in UIRecordStyle]: CSSGlobalVarFunction<P>;
};
