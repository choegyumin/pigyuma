import { UIRecordStyleVar } from '@/types/Style';
import { CSSVarFunction } from '@vanilla-extract/private';

export const varNames = UIRecordStyleVar;

/** @todo 반복문으로 자동화 및 모듈 분리 */
export const vars = {
  x: `var(${varNames.x})` as CSSVarFunction,
  y: `var(${varNames.y})` as CSSVarFunction,
  width: `var(${varNames.width})` as CSSVarFunction,
  height: `var(${varNames.height})` as CSSVarFunction,
  degrees: `var(${varNames.degrees})` as CSSVarFunction,
  strokeColor: `var(${varNames.strokeColor})` as CSSVarFunction,
  strokePattern: `var(${varNames.strokePattern})` as CSSVarFunction,
  strokeWidth: `var(${varNames.strokeWidth})` as CSSVarFunction,
  background: `var(${varNames.background})` as CSSVarFunction,
  textColor: `var(${varNames.textColor})` as CSSVarFunction,
  fontSize: `var(${varNames.fontSize})` as CSSVarFunction,
  lineHeight: `var(${varNames.lineHeight})` as CSSVarFunction,
  fontWeight: `var(${varNames.fontWeight})` as CSSVarFunction,
  letterSpacing: `var(${varNames.letterSpacing})` as CSSVarFunction,
};
