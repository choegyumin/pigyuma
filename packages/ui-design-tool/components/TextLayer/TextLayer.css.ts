import { mapEntries, pick } from '@pigyuma/utils';
import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { vars as uiRecordVars, varNames as uiRecordVarNames } from '../UIRecord/UIRecord.css';

const pickedVars = ['x', 'y', 'width', 'height', 'rotate', 'textColor', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing'] as const;

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
  display: 'inline-block',
  position: 'relative',
  top: vars.y,
  left: vars.x,
  rotate: getter.cssRotate,
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
