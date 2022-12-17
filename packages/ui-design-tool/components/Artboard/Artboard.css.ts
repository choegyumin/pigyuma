import { mapEntries, pick } from '@pigyuma/utils';
import { globalStyle, style } from '@vanilla-extract/css';
import { vars as uiRecordVars, varNames as uiRecordVarNames } from '../UIRecord/UIRecord.css';

const pickedVars = ['x', 'y', 'width', 'height'] as const;

export const varNames = pick(uiRecordVarNames, pickedVars);

export const vars = pick(uiRecordVars, pickedVars);

const emptyVars = mapEntries(vars, (value) => [value, '' as const]);

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
