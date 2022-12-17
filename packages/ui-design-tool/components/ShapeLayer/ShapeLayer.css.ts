import { mapEntries, pick } from '@pigyuma/utils';
import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { vars as uiRecordVars, varNames as uiRecordVarNames } from '../UIRecord/UIRecord.css';

const pickedVars = ['x', 'y', 'width', 'height', 'rotate', 'strokeColor', 'strokePattern', 'strokeWidth', 'background'] as const;

export const varNames = pick(uiRecordVarNames, pickedVars);

export const vars = pick(uiRecordVars, pickedVars);

const emptyVars = mapEntries(vars, (value) => [value, '' as const]);

const getter = {
  cssRotate: createVar(),
};

export const root = style({
  vars: {
    ...emptyVars,
    /** @see {@link https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-and-position#Rotation} */
    [getter.cssRotate]: `calc(${vars.rotate} * -1)`,
  },
  display: 'block',
  position: 'absolute',
  top: vars.y,
  left: vars.x,
  rotate: getter.cssRotate,
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
