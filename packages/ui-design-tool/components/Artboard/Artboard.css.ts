import { globalStyle, style } from '@vanilla-extract/css';
import { vars as uiRecordVars, varNames as uiRecordVarNames } from '../UIRecord/UIRecord.css';

export const varNames = {
  x: uiRecordVarNames.x,
  y: uiRecordVarNames.y,
  width: uiRecordVarNames.width,
  height: uiRecordVarNames.height,
};

export const vars = {
  x: uiRecordVars.x,
  y: uiRecordVars.y,
  width: uiRecordVars.width,
  height: uiRecordVars.height,
};

const emptyVars = {
  [vars.x]: '',
  [vars.y]: '',
  [vars.width]: '',
  [vars.height]: '',
};

export const root = style({
  vars: emptyVars,
  overflow: 'hidden',
  position: 'absolute',
  background: '#fff',
  transform: `translate3d(${vars.x}, ${vars.y}, 0)`,
  width: vars.width,
  height: vars.height,
});

globalStyle(`:where(${root} > *)`, {
  vars: emptyVars,
});
