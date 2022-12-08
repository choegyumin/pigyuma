import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { vars as uiRecordVars, varNames as uiRecordVarNames } from '../UIRecord/UIRecord.css';

export const varNames = {
  x: uiRecordVarNames.x,
  y: uiRecordVarNames.y,
  width: uiRecordVarNames.width,
  height: uiRecordVarNames.height,
  degrees: uiRecordVarNames.degrees,
  textColor: uiRecordVarNames.textColor,
  fontSize: uiRecordVarNames.fontSize,
  lineHeight: uiRecordVarNames.lineHeight,
  fontWeight: uiRecordVarNames.fontWeight,
  letterSpacing: uiRecordVarNames.letterSpacing,
};

export const vars = {
  x: uiRecordVars.x,
  y: uiRecordVars.y,
  width: uiRecordVars.width,
  height: uiRecordVars.height,
  degrees: uiRecordVars.degrees,
  textColor: uiRecordVars.textColor,
  fontSize: uiRecordVars.fontSize,
  lineHeight: uiRecordVars.lineHeight,
  fontWeight: uiRecordVars.fontWeight,
  letterSpacing: uiRecordVars.letterSpacing,
};

const emptyVars = {
  [vars.x]: '',
  [vars.y]: '',
  [vars.width]: '',
  [vars.height]: '',
  [vars.degrees]: '',
  [vars.textColor]: '',
  [vars.fontSize]: '',
  [vars.lineHeight]: '',
  [vars.fontWeight]: '',
  [vars.letterSpacing]: '',
};

const getter = {
  rotate: createVar(),
};

export const root = style({
  vars: {
    ...emptyVars,
    [getter.rotate]: `calc(${vars.degrees} * -1)`,
  },
  display: 'inline-block',
  position: 'relative',
  top: vars.y,
  left: vars.x,
  rotate: getter.rotate,
  width: vars.width,
  height: vars.height,
  color: vars.textColor,
  fontSize: vars.fontSize,
  lineHeight: vars.lineHeight,
  fontWeight: vars.fontWeight,
  letterSpacing: vars.letterSpacing,
  contentVisibility: 'auto',
});

globalStyle(`:where(${root} > *)`, {
  vars: emptyVars,
});
