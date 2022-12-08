import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { vars as uiRecordVars, varNames as uiRecordVarNames } from '../UIRecord/UIRecord.css';

export const varNames = {
  x: uiRecordVarNames.x,
  y: uiRecordVarNames.y,
  width: uiRecordVarNames.width,
  height: uiRecordVarNames.height,
  degrees: uiRecordVarNames.degrees,
  strokeColor: uiRecordVarNames.strokeColor,
  strokePattern: uiRecordVarNames.strokePattern,
  strokeWidth: uiRecordVarNames.strokeWidth,
  background: uiRecordVarNames.background,
};

export const vars = {
  x: uiRecordVars.x,
  y: uiRecordVars.y,
  width: uiRecordVars.width,
  height: uiRecordVars.height,
  degrees: uiRecordVars.degrees,
  strokeColor: uiRecordVars.strokeColor,
  strokePattern: uiRecordVars.strokePattern,
  strokeWidth: uiRecordVars.strokeWidth,
  background: uiRecordVars.background,
};

const emptyVars = {
  [vars.x]: '',
  [vars.y]: '',
  [vars.degrees]: '',
  [vars.width]: '',
  [vars.height]: '',
  [vars.strokeColor]: '',
  [vars.strokePattern]: '',
  [vars.strokeWidth]: '',
  [vars.background]: '',
};

const getter = {
  rotate: createVar(),
};

export const root = style({
  vars: {
    ...emptyVars,
    [getter.rotate]: `calc(${vars.degrees} * -1)`,
  },
  display: 'block',
  position: 'absolute',
  top: vars.y,
  left: vars.x,
  rotate: getter.rotate,
  width: vars.width,
  height: vars.height,
  border: `0 ${vars.strokePattern} ${vars.strokeColor}`,
  borderWidth: vars.strokeWidth,
  background: vars.background,
  contentVisibility: 'auto',
});

globalStyle(`:where(${root} > *)`, {
  vars: emptyVars,
});
